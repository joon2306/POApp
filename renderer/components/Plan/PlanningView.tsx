import React, { useState, useRef } from 'react';
import {
  X, Plus, Trash2, Layers, ArrowRight, AlertTriangle,
  CheckCircle2, Box, Clock, GripVertical, CornerDownRight,
  ChevronDown, ClipboardCheck, FlaskConical
} from 'lucide-react';
import { Feature, Epic, UserStory, TechnicalAnalysis, ImplementationStep, TestCase } from "./types/types";
import useNotes from '../../hooks/planning/useNotes';
import NotesService from '../../services/impl/NotesService';
import useEpic from '../../hooks/planning/useEpic';
import EpicService from '../../services/impl/EpicService';

interface PlanningViewProps {
  feature: Feature;
  onClose: () => void;
}

// --- Recursive Step Node Component ---
interface StepNodeProps {
  step: ImplementationStep;
  depth: number;
  onUpdate: (id: string, content: string) => void;
  onAddSubStep: (parentId: string) => void;
  onRemove: (id: string) => void;
}

const StepNode: React.FC<StepNodeProps> = ({ step, depth, onUpdate, onAddSubStep, onRemove }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(step.id, e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="relative animate-in fade-in duration-200">
      <div className={`flex gap-3 group relative ${depth > 0 ? 'mt-3' : 'mt-4'}`}>

        {/* Visual Hierarchy Lines */}
        {depth > 0 && (
          <div
            className="absolute -left-5 top-4 w-5 h-px rounded-full"
            style={{ backgroundColor: '#cbd5e1' }} // slate-300
          />
        )}

        {/* Indicator / Bullet */}
        <div
          className="mt-3 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center z-10"
          style={{
            backgroundColor: '#ffffff',
            borderColor: step.subSteps.length > 0 ? '#6366f1' : '#cbd5e1' // indigo-500 : slate-300
          }}
        >
          {step.subSteps.length > 0 && (
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#6366f1' }} // indigo-500
            />
          )}
        </div>

        <div className="flex-1">
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder={depth === 0 ? "What is the high-level step?" : "How exactly will you do this?"}
              className="w-full p-3 rounded-lg border-transparent focus:ring-2 outline-none resize-none overflow-hidden shadow-sm text-sm transition-all"
              style={{
                backgroundColor: depth === 0 ? '#f8fafc' : '#ffffff', // slate-50 : white
                fontWeight: depth === 0 ? 500 : 400,
                border: depth === 0 ? '1px solid transparent' : '1px solid #e2e8f0', // slate-200
                color: '#334155' // slate-700
              }}
              value={step.content}
              onChange={handleInput}
            />

            {/* Context Actions */}
            <div
              className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur px-1 rounded-md shadow-sm border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: '#f1f5f9' // slate-100
              }}
            >
              <button
                onClick={() => onAddSubStep(step.id)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded transition-colors mr-1 hover:bg-opacity-50"
                style={{ color: '#4f46e5', backgroundColor: 'transparent' }} // indigo-600
                title="Break this down further"
              >
                <CornerDownRight className="w-3 h-3" />
                How?
              </button>
              <div className="w-px h-3 mx-1" style={{ backgroundColor: '#e2e8f0' }}></div>
              <button
                onClick={() => onRemove(step.id)}
                className="p-1 transition-colors hover:text-opacity-80"
                style={{ color: '#94a3b8' }} // slate-400
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Prompt to break down if empty and no children */}
          {step.content && step.subSteps.length === 0 && (
            <button
              onClick={() => onAddSubStep(step.id)}
              className="mt-1 text-[11px] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
              style={{ color: '#818cf8' }} // indigo-400
            >
              <CornerDownRight className="w-3 h-3" />
              Is this step too big? Break it down...
            </button>
          )}
        </div>
      </div>

      {/* Recursive Children */}
      {step.subSteps.length > 0 && (
        <div
          className="ml-[1.35rem] pl-4 border-l-2 space-y-1"
          style={{ borderColor: '#f1f5f9' }} // slate-100
        >
          {step.subSteps.map(subStep => (
            <StepNode
              key={subStep.id}
              step={subStep}
              depth={depth + 1}
              onUpdate={onUpdate}
              onAddSubStep={onAddSubStep}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};


// --- Main Component ---

export const PlanningView: React.FC<PlanningViewProps> = ({ feature, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stories' | 'analysis' | 'validation'>('stories');

  const { notes, setNotes } = useNotes(feature.title, new NotesService());

  // --- State for the Plan ---
  const { epics, addEpic, modifyEpic, removeEpic } = useEpic(new EpicService());

  const [techAnalysis, setTechAnalysis] = useState<TechnicalAnalysis>({
    implementationSteps: [
      { id: 'root-1', content: '', subSteps: [] }
    ],
    dependencies: [],
    edgeCases: [],
    effortEstimate: 'Medium'
  });

  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: 'TC-001',
      title: '',
      priority: 'Medium',
      preConditions: '',
      steps: '',
      expectedResult: ''
    }
  ]);

  // --- Handlers for Epics ---
  const handleAddEpic = () => {
    addEpic([...epics, { name: '', description: '', stories: [] }]);
  };

  const updateEpic = (index: number, field: keyof Epic, value: any) => {
    const newEpics = [...epics];
    newEpics[index] = { ...newEpics[index], [field]: value };
    modifyEpic(newEpics);
  };

  const handleRemoveEpic = (index: number) => {
    if (window.confirm('Are you sure you want to delete this Epic?')) {
      removeEpic(epics.filter((_, i) => i !== index));
    }
  };

  // --- Handlers for User Stories ---
  const addStory = (epicIndex: number) => {
    const newEpics = [...epics];
    newEpics[epicIndex].stories.push({
      title: '',
      acceptanceCriteria: [],
      points: 1
    });
    addEpic(newEpics);
  };

  const updateStory = (epicIndex: number, storyIndex: number, field: keyof UserStory, value: any) => {
    const newEpics = [...epics];
    newEpics[epicIndex].stories[storyIndex] = {
      ...newEpics[epicIndex].stories[storyIndex],
      [field]: value
    };
    modifyEpic(newEpics);
  };

  const removeStory = (epicIndex: number, storyIndex: number) => {
    const newEpics = [...epics];
    newEpics[epicIndex].stories = newEpics[epicIndex].stories.filter((_, i) => i !== storyIndex);
    modifyEpic(newEpics);
  };

  // --- Handlers for Tech Analysis (Lists) ---
  const updateAnalysis = (field: keyof TechnicalAnalysis, value: any) => {
    setTechAnalysis(prev => ({ ...prev, [field]: value }));
  };

  const addListItem = (listName: 'dependencies' | 'edgeCases') => {
    setTechAnalysis(prev => ({
      ...prev,
      [listName]: [...prev[listName], '']
    }));
  };

  const updateListItem = (listName: 'dependencies' | 'edgeCases', index: number, value: string) => {
    const newList = [...techAnalysis[listName]];
    newList[index] = value;
    setTechAnalysis(prev => ({ ...prev, [listName]: newList }));
  };

  const removeListItem = (listName: 'dependencies' | 'edgeCases', index: number) => {
    setTechAnalysis(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  // --- Recursive Step Handlers ---

  const generateId = () => `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const updateStepRecursively = (steps: ImplementationStep[], id: string, content: string): ImplementationStep[] => {
    return steps.map(step => {
      if (step.id === id) {
        return { ...step, content };
      }
      if (step.subSteps.length > 0) {
        return { ...step, subSteps: updateStepRecursively(step.subSteps, id, content) };
      }
      return step;
    });
  };

  const addSubStepRecursively = (steps: ImplementationStep[], parentId: string): ImplementationStep[] => {
    return steps.map(step => {
      if (step.id === parentId) {
        return {
          ...step,
          subSteps: [...step.subSteps, { id: generateId(), content: '', subSteps: [] }]
        };
      }
      if (step.subSteps.length > 0) {
        return { ...step, subSteps: addSubStepRecursively(step.subSteps, parentId) };
      }
      return step;
    });
  };

  const removeStepRecursively = (steps: ImplementationStep[], id: string): ImplementationStep[] => {
    return steps
      .filter(step => step.id !== id)
      .map(step => ({
        ...step,
        subSteps: removeStepRecursively(step.subSteps, id)
      }));
  };

  const handleStepUpdate = (id: string, content: string) => {
    setTechAnalysis(prev => ({
      ...prev,
      implementationSteps: updateStepRecursively(prev.implementationSteps, id, content)
    }));
  };

  const handleAddSubStep = (parentId: string) => {
    setTechAnalysis(prev => ({
      ...prev,
      implementationSteps: addSubStepRecursively(prev.implementationSteps, parentId)
    }));
  };

  const handleRemoveStep = (id: string) => {
    setTechAnalysis(prev => ({
      ...prev,
      implementationSteps: removeStepRecursively(prev.implementationSteps, id)
    }));
  };

  const addRootStep = () => {
    setTechAnalysis(prev => ({
      ...prev,
      implementationSteps: [...prev.implementationSteps, { id: generateId(), content: '', subSteps: [] }]
    }));
  };

  // --- Handlers for Test Cases ---
  const addTestCase = () => {
    const newId = `TC-${String(testCases.length + 1).padStart(3, '0')}`;
    setTestCases([...testCases, {
      id: newId,
      title: '',
      priority: 'Medium',
      preConditions: '',
      steps: '',
      expectedResult: ''
    }]);
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const newCases = [...testCases];
    newCases[index] = { ...newCases[index], [field]: value };
    setTestCases(newCases);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-[95vw] h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border"
        style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} // white, slate-200
      >

        {/* Header */}
        <div
          className="px-8 py-5 border-b flex justify-between items-center shrink-0"
          style={{ backgroundColor: '#ffffff', borderColor: '#f1f5f9' }} // white, slate-100
        >
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: '#1e293b' }} // slate-800
            >
              {feature.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors hover:bg-slate-100"
            style={{ color: '#94a3b8' }} // slate-400
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Left Pane: Scratchpad / Notes */}
          <div
            className="w-[350px] border-r flex flex-col shrink-0"
            style={{
              backgroundColor: 'rgba(248, 250, 252, 0.8)', // slate-50/80
              borderColor: '#f1f5f9' // slate-100
            }}
          >
            <div className="p-6 flex-1 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-sm font-bold uppercase tracking-wider flex items-center"
                  style={{ color: '#64748b' }} // slate-500
                >
                  <Box className="w-4 h-4 mr-2" />
                  Notes & Brainstorming
                </h3>
              </div>
              <textarea
                className="flex-1 w-full p-4 rounded-xl border focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none leading-relaxed shadow-sm text-sm transition-all"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0', // slate-200
                  color: '#334155' // slate-700
                }}
                placeholder="Type your raw thoughts here...&#10;- What is the goal?&#10;- Who is the user?&#10;- Technical constraints?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
              <p
                className="text-xs mt-3 text-center"
                style={{ color: '#94a3b8' }} // slate-400
              >
                Use this space to draft ideas before structuring them.
              </p>
            </div>
          </div>

          {/* Right Pane: Structured Editor */}
          <div
            className="flex-1 flex flex-col relative"
            style={{ backgroundColor: '#ffffff' }}
          >

            {/* Tabs */}
            <div
              className="flex border-b px-6 pt-2"
              style={{ borderColor: '#f1f5f9' }} // slate-100
            >
              <button
                onClick={() => setActiveTab('stories')}
                className="mr-8 pb-4 text-sm font-bold flex items-center transition-all border-b-2"
                style={activeTab === "stories"
                  ? { color: "#4f46e5", borderColor: "#4f46e5" }
                  : { color: "#94a3b8", borderColor: "transparent" }
                }
              >
                <Layers className="w-4 h-4 mr-2" />
                Agile Breakdown
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className="mr-8 pb-4 text-sm font-bold flex items-center transition-all border-b-2"
                style={activeTab === "analysis"
                  ? { color: "#9333ea", borderColor: "#9333ea" }
                  : { color: "#94a3b8", borderColor: "transparent" }
                }
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Technical Analysis
              </button>
              <button
                onClick={() => setActiveTab('validation')}
                className="pb-4 text-sm font-bold flex items-center transition-all border-b-2"
                style={activeTab === "validation"
                  ? { color: "#0d9488", borderColor: "#0d9488" }
                  : { color: "#94a3b8", borderColor: "transparent" }
                }
              >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Validation
              </button>
            </div>

            {/* Content Area */}
            <div
              className="flex-1 overflow-y-auto p-8 custom-scrollbar"
              style={{ backgroundColor: '#ffffff' }}
            >

              {/* --- AGILE STORIES TAB --- */}
              {activeTab === 'stories' && (
                <div className="space-y-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-2 duration-300">

                  {epics.map((epic, epicIdx) => (
                    <div
                      key={epicIdx}
                      className="group border rounded-2xl p-1 shadow-sm hover:shadow-md transition-shadow"
                      style={{
                        backgroundColor: 'rgba(248, 250, 252, 0.5)', // slate-50/50
                        borderColor: '#e2e8f0' // slate-200
                      }}
                    >
                      {/* Epic Header */}
                      <div
                        className="p-5 rounded-xl border-b relative"
                        style={{ backgroundColor: '#ffffff', borderColor: '#f1f5f9' }} // white, slate-100
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 select-none"
                            style={{ color: "#4f46e5", backgroundColor: "#e0e7ff" }} // indigo-600, indigo-100
                          >
                            EPIC
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              placeholder="Epic Name"
                              className="w-full font-bold text-lg bg-transparent border-none focus:ring-0 p-0 focus:bg-slate-50 rounded px-2 -ml-2 transition-colors"
                              style={{ color: '#1e293b' }} // slate-800
                              value={epic.name}
                              onChange={(e) => updateEpic(epicIdx, 'name', e.target.value)}
                            />
                            <textarea
                              rows={1}
                              placeholder="What is the goal of this epic?"
                              className="w-full text-sm bg-transparent border-none focus:ring-0 p-0 focus:bg-slate-50 rounded px-2 -ml-2 resize-none transition-colors"
                              style={{ color: '#475569' }} // slate-600
                              value={epic.description}
                              onChange={(e) => updateEpic(epicIdx, 'description', e.target.value)}
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveEpic(epicIdx)}
                            className="transition-colors p-2 hover:text-red-400"
                            style={{ color: '#cbd5e1' }} // slate-300
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Stories List */}
                      <div className="p-4 space-y-3">
                        {epic?.stories?.map((story, storyIdx) => (
                          <div
                            key={storyIdx}
                            className="flex items-center gap-3 p-3 rounded-lg border shadow-sm group/story hover:border-indigo-300 transition-all"
                            style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} // white, slate-200
                          >
                            <GripVertical className="w-4 h-4 cursor-move" style={{ color: '#cbd5e1' }} />
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="User Story Title"
                                className="w-full font-medium bg-transparent border-none focus:ring-0 p-0 focus:underline decoration-indigo-200 underline-offset-4 text-sm"
                                style={{ color: '#334155' }} // slate-700
                                value={story.title}
                                onChange={(e) => updateStory(epicIdx, storyIdx, 'title', e.target.value)}
                              />
                            </div>
                            <div
                              className="flex items-center gap-2 border-l pl-3"
                              style={{ borderColor: '#f1f5f9' }} // slate-100
                            >
                              <span className="text-xs font-bold uppercase" style={{ color: '#94a3b8' }}>Pts</span>
                              <input
                                type="number"
                                className="w-12 text-center font-mono text-sm border-transparent focus:border-indigo-500 focus:ring-0 rounded-md py-1 px-0 font-bold"
                                style={{ backgroundColor: '#f8fafc', color: '#475569' }} // slate-50, slate-600
                                value={story.points}
                                onChange={(e) => updateStory(epicIdx, storyIdx, 'points', parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <button
                              onClick={() => removeStory(epicIdx, storyIdx)}
                              className="opacity-0 group-hover/story:opacity-100 transition-opacity p-1 hover:text-red-400"
                              style={{ color: '#cbd5e1' }} // slate-300
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        <button
                          onClick={() => addStory(epicIdx)}
                          className="w-full py-2 border-2 border-dashed rounded-lg text-sm font-medium hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                          style={{ borderColor: '#e2e8f0', color: '#94a3b8' }} // slate-200, slate-400
                        >
                          <Plus className="w-4 h-4" />
                          Add User Story
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddEpic}
                    className="w-full py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#1e293b', color: '#ffffff' }} // slate-800, white
                  >
                    <Plus className="w-5 h-5" />
                    Add New Epic
                  </button>

                </div>
              )}

              {/* --- TECHNICAL ANALYSIS TAB --- */}
              {activeTab === 'analysis' && (
                <div className="space-y-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-2 duration-300">

                  {/* Effort Section */}
                  <div
                    className="p-6 rounded-2xl border shadow-sm"
                    style={{ backgroundColor: '#ffffff', borderColor: '#f3e8ff' }} // white, purple-100
                  >
                    <h4
                      className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center"
                      style={{ color: "#581c87" }} // purple-900
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Effort Estimation
                    </h4>
                    <input
                      type="text"
                      placeholder="e.g. 2 Sprints, 13 Points, T-Shirt Size L..."
                      className="w-full text-xl font-medium placeholder:text-slate-300 border-b-2 focus:border-purple-500 focus:ring-0 border-t-0 border-x-0 px-0 py-2 transition-colors bg-transparent"
                      style={{ color: '#334155', borderColor: '#f1f5f9' }} // slate-700, slate-100
                      value={techAnalysis.effortEstimate}
                      onChange={(e) => updateAnalysis('effortEstimate', e.target.value)}
                    />
                  </div>

                  {/* Implementation Steps (Recursive) */}
                  <div
                    className="p-6 rounded-2xl border shadow-sm"
                    style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} // white, slate-200
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className="text-sm font-bold uppercase tracking-wider flex items-center"
                        style={{ color: "#334155" }} // slate-700
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" style={{ color: "#10b981" }} />
                        Implementation Steps
                      </h4>
                      <span className="text-xs" style={{ color: '#94a3b8' }}>Break down steps by asking "How?"</span>
                    </div>

                    <div className="pl-2">
                      {techAnalysis.implementationSteps.map((step, idx) => (
                        <StepNode
                          key={step.id}
                          step={step}
                          depth={0}
                          onUpdate={handleStepUpdate}
                          onAddSubStep={handleAddSubStep}
                          onRemove={handleRemoveStep}
                        />
                      ))}

                      <button
                        onClick={addRootStep}
                        className="ml-1 mt-6 py-2 px-4 rounded-lg text-sm font-bold hover:text-indigo-600 transition-all flex items-center gap-2 border"
                        style={{
                          backgroundColor: '#f8fafc', // slate-50
                          color: '#475569', // slate-600
                          borderColor: '#e2e8f0' // slate-200
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add High Level Step
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dependencies */}
                    <div
                      className="p-6 rounded-2xl border"
                      style={{ backgroundColor: 'rgba(255, 247, 237, 0.5)', borderColor: '#ffedd5' }} // orange-50/50, orange-100
                    >
                      <h4
                        className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center"
                        style={{ color: '#9a3412' }} // orange-800
                      >
                        <Layers className="w-4 h-4 mr-2" />
                        Dependencies
                      </h4>
                      <div className="space-y-2">
                        {techAnalysis.dependencies.map((dep, idx) => (
                          <div key={idx} className="flex gap-2 group">
                            <input
                              type="text"
                              placeholder="Add dependency..."
                              className="flex-1 text-sm rounded-md px-3 py-2 focus:ring-orange-200 focus:border-orange-300"
                              style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#ffedd5',
                                color: '#334155'
                              }}
                              value={dep}
                              onChange={(e) => updateListItem('dependencies', idx, e.target.value)}
                            />
                            <button
                              onClick={() => removeListItem('dependencies', idx)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                              style={{ color: '#fdba74' }} // orange-300
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addListItem('dependencies')}
                          className="w-full py-2 border rounded-md text-sm font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: '#ffffff',
                            borderColor: '#ffedd5', // orange-100
                            color: '#ea580c' // orange-600
                          }}
                        >
                          <Plus className="w-3 h-3" /> Add Dependency
                        </button>
                      </div>
                    </div>

                    {/* Edge Cases */}
                    <div
                      className="p-6 rounded-2xl border"
                      style={{ backgroundColor: 'rgba(254, 242, 242, 0.5)', borderColor: '#fee2e2' }} // red-50/50, red-100
                    >
                      <h4
                        className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center"
                        style={{ color: '#991b1b' }} // red-800
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Edge Cases
                      </h4>
                      <div className="space-y-2">
                        {techAnalysis.edgeCases.map((ec, idx) => (
                          <div key={idx} className="flex gap-2 group">
                            <input
                              type="text"
                              placeholder="Add edge case..."
                              className="flex-1 text-sm rounded-md px-3 py-2 focus:ring-red-200 focus:border-red-300"
                              style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#fee2e2',
                                color: '#334155'
                              }}
                              value={ec}
                              onChange={(e) => updateListItem('edgeCases', idx, e.target.value)}
                            />
                            <button
                              onClick={() => removeListItem('edgeCases', idx)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                              style={{ color: '#fca5a5' }} // red-300
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addListItem('edgeCases')}
                          className="w-full py-2 border rounded-md text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: '#ffffff',
                            borderColor: '#fee2e2', // red-100
                            color: '#dc2626' // red-600
                          }}
                        >
                          <Plus className="w-3 h-3" /> Add Edge Case
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- VALIDATION TAB --- */}
              {activeTab === 'validation' && (
                <div className="space-y-6 max-w-5xl mx-auto animate-in slide-in-from-bottom-2 duration-300">
                  <div
                    className="border p-4 rounded-xl mb-6 flex items-start gap-3"
                    style={{ backgroundColor: 'rgba(240, 253, 250, 0.5)', borderColor: '#ccfbf1' }} // teal-50/50, teal-100
                  >
                    <FlaskConical className="w-5 h-5 mt-0.5" style={{ color: '#0d9488' }} />
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: '#115e59' }}>Validation & QA Strategy</h4>
                      <p className="text-sm mt-1" style={{ color: 'rgba(13, 148, 136, 0.8)' }}>Define the acceptance tests required to verify this feature meets all requirements.</p>
                    </div>
                  </div>

                  {testCases.map((tc, idx) => (
                    <div
                      key={tc.id}
                      className="rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all"
                      style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                    >
                      {/* Card Header */}
                      <div
                        className="px-6 py-4 border-b flex items-center justify-between"
                        style={{ backgroundColor: 'rgba(248, 250, 252, 0.5)', borderColor: '#f1f5f9' }}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <span
                            className="font-mono text-xs font-bold px-2 py-1 rounded"
                            style={{ backgroundColor: '#e2e8f0', color: '#475569' }}
                          >
                            {tc.id}
                          </span>
                          <input
                            type="text"
                            placeholder="Test Case Title"
                            className="flex-1 bg-transparent font-semibold border-none focus:ring-0 p-0"
                            style={{ color: '#1e293b' }}
                            value={tc.title}
                            onChange={(e) => updateTestCase(idx, 'title', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <select
                              value={tc.priority}
                              onChange={(e) => updateTestCase(idx, 'priority', e.target.value)}
                              className={`appearance-none pl-3 pr-8 py-1 rounded-md text-xs font-bold uppercase tracking-wide border-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 outline-none`}
                              style={{
                                backgroundColor: tc.priority === 'High' ? '#fee2e2' : tc.priority === 'Medium' ? '#ffedd5' : '#dbeafe',
                                color: tc.priority === 'High' ? '#b91c1c' : tc.priority === 'Medium' ? '#c2410c' : '#1d4ed8',
                              }}
                            >
                              <option value="High">High Priority</option>
                              <option value="Medium">Medium Priority</option>
                              <option value="Low">Low Priority</option>
                            </select>
                            <ChevronDown className="w-3 h-3 absolute right-2 top-1.5 pointer-events-none opacity-50" />
                          </div>

                          <button
                            onClick={() => removeTestCase(idx)}
                            className="transition-colors hover:text-red-400"
                            style={{ color: '#cbd5e1' }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pre-conditions */}
                        <div className="md:col-span-1 space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#94a3b8' }}>Pre-Conditions</label>
                          <textarea
                            rows={3}
                            className="w-full text-sm border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-0 resize-none p-3"
                            style={{ backgroundColor: '#f8fafc', color: '#475569' }}
                            placeholder="- User is logged in&#10;- Data exists"
                            value={tc.preConditions}
                            onChange={(e) => updateTestCase(idx, 'preConditions', e.target.value)}
                          />
                        </div>

                        {/* Steps */}
                        <div className="md:col-span-1 space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#94a3b8' }}>Test Steps</label>
                          <textarea
                            rows={3}
                            className="w-full text-sm border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-0 resize-none p-3"
                            style={{ backgroundColor: '#f8fafc', color: '#475569' }}
                            placeholder="1. Go to settings&#10;2. Click save"
                            value={tc.steps}
                            onChange={(e) => updateTestCase(idx, 'steps', e.target.value)}
                          />
                        </div>

                        {/* Expected Result */}
                        <div className="md:col-span-1 space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#94a3b8' }}>Expected Result</label>
                          <textarea
                            rows={3}
                            className="w-full text-sm border-transparent rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-0 resize-none p-3"
                            style={{ backgroundColor: 'rgba(236, 253, 245, 0.5)', color: '#475569' }}
                            placeholder="Success message appears."
                            value={tc.expectedResult}
                            onChange={(e) => updateTestCase(idx, 'expectedResult', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addTestCase}
                    className="w-full py-4 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#1e293b' }}
                  >
                    <Plus className="w-5 h-5" />
                    Add Test Case
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};