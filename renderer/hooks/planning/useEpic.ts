import { useEffect, useRef, useState, useCallback } from "react";
import { Epic, UserStory } from "../../components/Plan/types/types";
import IEpicService from "../../services/IEpicService";
import EpicHelper from "../../helpers/EpicHelper";
import StoryHelper from "../../helpers/StoryHelper";
import IStoryService from "../../services/IStoryService";
import { debounce } from "../../helpers/debounce";

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

    }, [epicService]);

    // --- Debounced Service Calls ---

    const debouncedModifyEpic = useCallback(
        debounce((updatedEpic: Epic) => {
            epicService.modifyEpic(updatedEpic).catch(error => {
                console.error("Error saving epic: ", error);
            });
        }, 500),
        [epicService]
    );

    const debouncedModifyStory = useCallback(
        debounce((updatedStory: UserStory) => {
            userStoryService.modifyStory(updatedStory).catch(error => {
                console.error("Error saving story: ", error);
            });
        }, 500),
        [userStoryService]
    );

    // --- State Update and Service Call Logic ---

    const addEpic = (newEpics: Epic[]) => {
        const tempEpicHelper = new EpicHelper(epics);
        const newEpic = tempEpicHelper.retrieveUpdated(newEpics).match({ ok: e => e, err: () => null });
        
        setEpics(newEpics);
        epicHelperRef.current = new EpicHelper(newEpics);
        storyHelperRef.current = new StoryHelper(newEpics);

        if (newEpic) {
            epicService.addEpic(newEpic as Epic).then(createdEpic => {
                setEpics(currentEpics => {
                    const finalEpics = currentEpics.map(e => e.name === createdEpic.name ? createdEpic : e);
                    epicHelperRef.current = new EpicHelper(finalEpics);
                    storyHelperRef.current = new StoryHelper(finalEpics);
                    return finalEpics;
                });
            });
        }
    };

    const modifyEpic = (newEpics: Epic[]) => {
        const tempEpicHelper = new EpicHelper(epics);
        const updatedEpic = tempEpicHelper.retrieveUpdated(newEpics).match({ ok: e => e, err: () => null });

        setEpics(newEpics);
        epicHelperRef.current = new EpicHelper(newEpics);
        storyHelperRef.current = new StoryHelper(newEpics);

        if (updatedEpic) {
            debouncedModifyEpic(updatedEpic as Epic);
        }
    };

    const removeEpic = (newEpics: Epic[]) => {
        const tempEpicHelper = new EpicHelper(epics);
        const deletedEpic = tempEpicHelper.retrieveUpdated(newEpics).match({ ok: e => e, err: () => null });
        
        setEpics(newEpics);
        epicHelperRef.current = new EpicHelper(newEpics);
        storyHelperRef.current = new StoryHelper(newEpics);

        if (deletedEpic) {
            epicService.removeEpic(deletedEpic as Epic);
        }
    };

    const addUserStory = (newEpics: Epic[]) => {
        const tempStoryHelper = new StoryHelper(epics);
        const { story: newStory } = tempStoryHelper.retrieveUpdated(newEpics).match({ ok: s => s, err: () => ({ story: null }) });

        setEpics(newEpics);
        epicHelperRef.current = new EpicHelper(newEpics);
        storyHelperRef.current = new StoryHelper(newEpics);

        if (newStory) {
            userStoryService.addStory(newStory as UserStory).then(createdStory => {
                setEpics(currentEpics => {
                    const finalEpics = currentEpics.map(e => {
                        if (e.id === createdStory.epicRef) {
                            e.stories = e.stories.map(s => s.title === createdStory.title ? createdStory : s);
                        }
                        return e;
                    });
                    epicHelperRef.current = new EpicHelper(finalEpics);
                    storyHelperRef.current = new StoryHelper(finalEpics);
                    return finalEpics;
                });
            });
        }
    };

    const modifyUserStory = (newEpics: Epic[]) => {
        const tempStoryHelper = new StoryHelper(epics);
        const { story: updatedStory } = tempStoryHelper.retrieveUpdated(newEpics).match({ ok: s => s, err: () => ({ story: null }) });

        setEpics(newEpics);
        epicHelperRef.current = new EpicHelper(newEpics);
        storyHelperRef.current = new StoryHelper(newEpics);

        if (updatedStory) {
            debouncedModifyStory(updatedStory as UserStory);
        }
    };

    const removeUserStory = (newEpics: Epic[]) => {
        const tempStoryHelper = new StoryHelper(epics);
        const { story: deletedStory } = tempStoryHelper.retrieveUpdated(newEpics).match({ ok: s => s, err: () => ({ story: null }) });

        setEpics(newEpics);
        epicHelperRef.current = new EpicHelper(newEpics);
        storyHelperRef.current = new StoryHelper(newEpics);

        if (deletedStory) {
            userStoryService.removeStory(deletedStory as UserStory);
        }
    };

    return { epics, addEpic, modifyEpic, removeEpic, addUserStory, modifyUserStory, removeUserStory };
}

