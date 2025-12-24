import { useEffect, useRef, useState } from "react";
import { Epic, UserStory } from "../../components/Plan/types/types";
import IEpicService from "../../services/IEpicService";
import EpicHelper from "../../helpers/EpicHelper";
import StoryHelper from "../../helpers/StoryHelper";
import UserStoryService from "../../services/impl/UserStoryService";
import IStoryService from "../../services/IStoryService";

export default function useEpic(epicService: IEpicService, userStoryService: IStoryService) {

    const [epics, setEpics] = useState<Epic[]>([
    ]);

    const epicHelperRef = useRef(new EpicHelper(epics));

    const storyHelperRef = useRef(new StoryHelper(epics));

    useEffect(() => {
        const loadEpics = async () => {
            const loadedEpics = await epicService.getEpics();
            setEpics(loadedEpics);
            epicHelperRef.current = new EpicHelper(loadedEpics);
        }

        loadEpics();

    }, [])


    const retrieveUpdatedEpic = (epics: Epic[]): Epic => {
        const epicHelper = epicHelperRef.current;
        const updatedEpicResult = epicHelper.retrieveUpdated(epics);
        const updatedEpic = updatedEpicResult.match({
            ok: (epic) => epic,
            err: (error) => {
                console.error("Error retrieving updated epic: ", error);
               return null;
            }
        });
        return updatedEpic as Epic;
    }

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


    const modifyEpic = (epic: Epic[]) => {
        const updatedEpic = retrieveUpdatedEpic(epic);
        if(updatedEpic === null) {
            setEpics(epic);
            return;
        }
        epicService.modifyEpic(updatedEpic)
            .then(id => {
                if (id !== 0) {
                    updatedEpic.id = id;
                    epic = epic.map(e => e.name === updatedEpic.name ? updatedEpic : e);
                }
                setEpics(epic);
            })
            .catch(error => {
                console.error("Error modifying epic: ", error);
            });
    }

    const removeEpic = (epic: Epic[]) => {
        const updatedEpic = retrieveUpdatedEpic(epic);
        if(updatedEpic === null) {
            setEpics(epic);
            return;
        }
        setEpics(epic);
        epicService.removeEpic(updatedEpic);
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


