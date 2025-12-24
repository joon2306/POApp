import { useEffect, useRef, useState, useCallback } from "react";
import { Epic, UserStory } from "../../components/Plan/types/types";
import IEpicService from "../../services/IEpicService";
import EpicHelper from "../../helpers/EpicHelper";
import StoryHelper from "../../helpers/StoryHelper";
import IStoryService from "../../services/IStoryService";
import { debounce } from "../../helpers/debounce";
import { time } from "console";

export default function useEpic(epicService: IEpicService, userStoryService: IStoryService) {

    const [epics, setEpics] = useState<Epic[]>([]);

    const epicHelperRef = useRef(new EpicHelper(epics));
    const storyHelperRef = useRef(new StoryHelper(epics));

    useEffect(() => {
        const loadEpics = async () => {
            const loadedEpics = await epicService.getEpics();
            setEpics(loadedEpics);
            epicHelperRef.current = new EpicHelper(loadedEpics);
            storyHelperRef.current = new StoryHelper(loadedEpics);
        }

        loadEpics();

    }, [epicService])


    const retrieveUpdatedStory = (epics: Epic[]): { epicRef: number, story: UserStory } => {
        const storyHelper = storyHelperRef.current;
        const updatedStoryResult = storyHelper.retrieveUpdated(epics);
        const updatedStory = updatedStoryResult.match({
            ok: (story) => story,
            err: (error) => {
                console.error("Error retrieving updated epic: ", error);
                throw error;
            }
        });
        return updatedStory as { epicRef: number, story: UserStory };
    }


    const addEpic = (epic: Epic[]) => {
        epicHelperRef.current = new EpicHelper(epic);
        setEpics(epic);
    }

    const debouncedSave = useCallback(
        debounce((updatedEpic: Epic) => {
            epicService.modifyEpic(updatedEpic).catch(error => {
                console.error("Error saving epic: ", error);
            });
        }, 500),
        [epicService]
    );

    const modifyEpic = (newEpics: Epic[]) => {
        // Use a temporary helper with the *current* state to find the changed epic.
        const tempEpicHelper = new EpicHelper(epics);
        const updatedEpic = tempEpicHelper.retrieveUpdated(newEpics).match({
            ok: epic => epic,
            err: () => null,
        });

        // Update UI immediately for responsiveness.
        setEpics(newEpics);
        epicHelperRef.current = new EpicHelper(newEpics);
        storyHelperRef.current = new StoryHelper(newEpics);

        if (updatedEpic) {
            debouncedSave(updatedEpic as Epic);
        }
    };

    const removeEpic = (epic: Epic[]) => {
        const tempEpicHelper = new EpicHelper(epics);
        const updatedEpic = tempEpicHelper.retrieveUpdated(epic).match({
            ok: epic => epic,
            err: () => null,
        });

        setEpics(epic);
        epicHelperRef.current = new EpicHelper(epic);
        storyHelperRef.current = new StoryHelper(epic);

        if(updatedEpic) {
            epicService.removeEpic(updatedEpic as Epic);
        }
    }

    const addUserStory = (epic: Epic[]) => {
        storyHelperRef.current = new StoryHelper(epic);
        setEpics(epic);
    }

    const modifyUserStory = (epic: Epic[]) => {
        const { epicRef, story: updatedStory } = retrieveUpdatedStory(epic);
        if(!updatedStory.epicRef) {
            updatedStory.epicRef = epicRef;
        }
        userStoryService.modifyStory(updatedStory)
            .then(id => {
                if (id !== 0) {
                    updatedStory.id = id;
                    epic = epic.map(e => {
                        if (e.id === epicRef) {
                            e.stories = e.stories.map(s => s.title === updatedStory.title ? updatedStory : s);
                        }
                        return e;
                    })
                }
                setEpics(epic);
            })
            .catch(error =>  console.error("Error modifying user story: ", error));
    }

    const removeUserStory = (epic: Epic[]) => {
        const { epicRef, story: updatedStory } = retrieveUpdatedStory(epic);
        setEpics(epic);
        userStoryService.removeStory(updatedStory);
    }

    return { epics, addEpic, modifyEpic, removeEpic, addUserStory, modifyUserStory, removeUserStory };
}

