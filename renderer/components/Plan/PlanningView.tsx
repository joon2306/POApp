
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, Layers, ArrowRight, AlertTriangle, CheckCircle2, Box, Clock, GripVertical, CornerDownRight, ChevronDown, ClipboardCheck, FlaskConical } from 'lucide-react';
import { Feature, Epic, UserStory, TechnicalAnalysis, ImplementationStep, TestCase } from "./types/types";

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
          <div className="absolute -left-5 top-4 w-5 h-px bg-slate-300 rounded-full" />
        )}
        
        {/* Indicator / Bullet */}
        <div className={`mt-3 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center z-10 bg-white
          ${step.subSteps.length > 0 ? 'border-indigo-500' : 'border-slate-300'}
        `}>
           {step.subSteps.length > 0 && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
        </div>

        <div className="flex-1">
           <div className="relative">
              <textarea 
                ref={textareaRef}
                rows={1}
                placeholder={depth === 0 ? "What is the high-level step?" : "How exactly will you do this?"}
                className={`w-full p-3 rounded-lg border-transparent focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700 resize-none overflow-hidden shadow-sm text-sm transition-all
                  ${depth === 0 ? 'bg-slate-50 font-medium' : 'bg-white border border-slate-200'}
                `}
                value={step.content}
                onChange={handleInput}
              />
              
              {/* Context Actions */}
              <div className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur px-1 rounded-md shadow-sm border border-slate-100">
                 <button 
                   onClick={() => onAddSubStep(step.id)}
                   className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded transition-colors mr-1"
                   title="Break this down further"
                 >
                    <CornerDownRight className="w-3 h-3" />
                    How?
                 </button>
                 <div className="w-px h-3 bg-slate-200 mx-1"></div>
                 <button 
                   onClick={() => onRemove(step.id)}
                   className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                 >
                   <X className="w-3 h-3" />
                 </button>
              </div>
           </div>

           {/* Prompt to break down if empty and no children */}
           {step.content && step.subSteps.length === 0 && (
             <button 
               onClick={() => onAddSubStep(step.id)}
               className="mt-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
             >
                <CornerDownRight className="w-3 h-3" />
                Is this step too big? Break it down...
             </button>
           )}
        </div>
      </div>

      {/* Recursive Children */}
      {step.subSteps.length > 0 && (
        <div className={`ml-[1.35rem] pl-4 border-l-2 border-slate-100 space-y-1`}>
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
  const [notes, setNotes] = useState('');
  
  // --- State for the Plan ---
  const [epics, setEpics] = useState<Epic[]>([
    { name: 'Core Functionality', description: 'Main feature implementation requirements', stories: [] }
  ]);
  
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
  const addEpic = () => {
    setEpics([...epics, { name: '', description: '', stories: [] }]);
  };

  const updateEpic = (index: number, field: keyof Epic, value: any) => {
    const newEpics = [...epics];
    newEpics[index] = { ...newEpics[index], [field]: value };
    setEpics(newEpics);
  };

  const removeEpic = (index: number) => {
    if (window.confirm('Are you sure you want to delete this Epic?')) {
      setEpics(epics.filter((_, i) => i !== index));
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
    setEpics(newEpics);
  };

  const updateStory = (epicIndex: number, storyIndex: number, field: keyof UserStory, value: any) => {
    const newEpics = [...epics];
    newEpics[epicIndex].stories[storyIndex] = {
      ...newEpics[epicIndex].stories[storyIndex],
      [field]: value
    };
    setEpics(newEpics);
  };

  const removeStory = (epicIndex: number, storyIndex: number) => {
    const newEpics = [...epics];
    newEpics[epicIndex].stories = newEpics[epicIndex].stories.filter((_, i) => i !== storyIndex);
    setEpics(newEpics);
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[95vw] h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <div className="flex items-center space-x-3 text-slate-400 text-sm mb-1 font-medium">
               <span className="uppercase tracking-wider">{feature.target}</span>
               <span className="text-slate-300">•</span>
               <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">{feature.id}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{feature.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Pane: Scratchpad / Notes */}
          <div className="w-[350px] border-r border-slate-100 flex flex-col bg-slate-50/80 shrink-0">
            <div className="p-6 flex-1 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <Box className="w-4 h-4 mr-2" />
                  Notes & Brainstorming
                </h3>
              </div>
              <textarea
                className="flex-1 w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none text-slate-700 leading-relaxed shadow-sm placeholder:text-slate-300 text-sm transition-all"
                placeholder="Type your raw thoughts here...&#10;- What is the goal?&#10;- Who is the user?&#10;- Technical constraints?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Use this space to draft ideas before structuring them.
              </p>
            </div>
          </div>

          {/* Right Pane: Structured Editor */}
          <div className="flex-1 flex flex-col bg-white relative">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-6 pt-2">
              <button
                onClick={() => setActiveTab('stories')}
                className={`mr-8 pb-4 text-sm font-bold flex items-center transition-all border-b-2 ${
                  activeTab === 'stories' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Layers className="w-4 h-4 mr-2" />
                Agile Breakdown
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`mr-8 pb-4 text-sm font-bold flex items-center transition-all border-b-2 ${
                  activeTab === 'analysis' 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Technical Analysis
              </button>
              <button
                onClick={() => setActiveTab('validation')}
                className={`pb-4 text-sm font-bold flex items-center transition-all border-b-2 ${
                  activeTab === 'validation' 
                    ? 'border-teal-600 text-teal-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Validation
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
              
              {/* --- AGILE STORIES TAB --- */}
              {activeTab === 'stories' && (
                <div className="space-y-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-2 duration-300">
                  
                  {epics.map((epic, epicIdx) => (
                    <div key={epicIdx} className="group border border-slate-200 rounded-2xl p-1 shadow-sm hover:shadow-md transition-shadow bg-slate-50/50">
                      {/* Epic Header */}
                      <div className="p-5 bg-white rounded-xl border-b border-slate-100 relative">
                         <div className="flex items-start gap-4">
                            <div className="mt-1 w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 select-none">
                              EPIC
                            </div>
                            <div className="flex-1 space-y-2">
                               <input 
                                 type="text"
                                 placeholder="Epic Name"
                                 className="w-full font-bold text-lg text-slate-800 placeholder:text-slate-300 bg-transparent border-none focus:ring-0 p-0 focus:bg-slate-50 rounded px-2 -ml-2 transition-colors"
                                 value={epic.name}
                                 onChange={(e) => updateEpic(epicIdx, 'name', e.target.value)}
                               />
                               <textarea 
                                  rows={1}
                                  placeholder="What is the goal of this epic?"
                                  className="w-full text-sm text-slate-600 placeholder:text-slate-300 bg-transparent border-none focus:ring-0 p-0 focus:bg-slate-50 rounded px-2 -ml-2 resize-none transition-colors"
                                  value={epic.description}
                                  onChange={(e) => updateEpic(epicIdx, 'description', e.target.value)}
                               />
                            </div>
                            <button 
                              onClick={() => removeEpic(epicIdx)}
                              className="text-slate-300 hover:text-red-400 transition-colors p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                      
                      {/* Stories List */}
                      <div className="p-4 space-y-3">
                        {epic.stories.map((story, storyIdx) => (
                          <div key={storyIdx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm group/story hover:border-indigo-300 transition-all">
                             <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                             <div className="flex-1">
                                <input 
                                  type="text"
                                  placeholder="User Story Title"
                                  className="w-full font-medium text-slate-700 placeholder:text-slate-300 bg-transparent border-none focus:ring-0 p-0 focus:underline decoration-indigo-200 underline-offset-4 text-sm"
                                  value={story.title}
                                  onChange={(e) => updateStory(epicIdx, storyIdx, 'title', e.target.value)}
                                />
                             </div>
                             <div className="flex items-center gap-2 border-l border-slate-100 pl-3">
                                <span className="text-xs font-bold text-slate-400 uppercase">Pts</span>
                                <input 
                                  type="number"
                                  className="w-12 text-center font-mono text-sm bg-slate-50 border-transparent focus:border-indigo-500 focus:ring-0 rounded-md py-1 px-0 text-slate-600 font-bold"
                                  value={story.points}
                                  onChange={(e) => updateStory(epicIdx, storyIdx, 'points', parseInt(e.target.value) || 0)}
                                />
                             </div>
                             <button 
                               onClick={() => removeStory(epicIdx, storyIdx)}
                               className="text-slate-300 hover:text-red-400 opacity-0 group-hover/story:opacity-100 transition-opacity p-1"
                             >
                               <X className="w-4 h-4" />
                             </button>
                          </div>
                        ))}
                        
                        <button 
                          onClick={() => addStory(epicIdx)}
                          className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm font-medium hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add User Story
                        </button>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={addEpic}
                    className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-700 hover:shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
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
                   <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
                      <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-4 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Effort Estimation
                      </h4>
                      <input 
                        type="text"
                        placeholder="e.g. 2 Sprints, 13 Points, T-Shirt Size L..."
                        className="w-full text-xl font-medium text-slate-700 placeholder:text-slate-300 border-b-2 border-slate-100 focus:border-purple-500 focus:ring-0 border-t-0 border-x-0 px-0 py-2 transition-colors bg-transparent"
                        value={techAnalysis.effortEstimate}
                        onChange={(e) => updateAnalysis('effortEstimate', e.target.value)}
                      />
                   </div>

                   {/* Implementation Steps (Recursive) */}
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                          Implementation Steps
                        </h4>
                        <span className="text-xs text-slate-400">Break down steps by asking "How?"</span>
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
                          className="ml-1 mt-6 py-2 px-4 rounded-lg bg-slate-50 text-slate-600 text-sm font-bold hover:bg-slate-100 hover:text-indigo-600 transition-all flex items-center gap-2 border border-slate-200"
                        >
                          <Plus className="w-4 h-4" /> 
                          Add High Level Step
                        </button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Dependencies */}
                      <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                         <h4 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-4 flex items-center">
                            <Layers className="w-4 h-4 mr-2" />
                            Dependencies
                         </h4>
                         <div className="space-y-2">
                           {techAnalysis.dependencies.map((dep, idx) => (
                             <div key={idx} className="flex gap-2 group">
                               <input 
                                  type="text"
                                  placeholder="Add dependency..."
                                  className="flex-1 bg-white border-orange-100 text-slate-700 text-sm rounded-md px-3 py-2 focus:ring-orange-200 focus:border-orange-300"
                                  value={dep}
                                  onChange={(e) => updateListItem('dependencies', idx, e.target.value)}
                               />
                               <button 
                                onClick={() => removeListItem('dependencies', idx)}
                                className="text-orange-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                <X className="w-4 h-4" />
                               </button>
                             </div>
                           ))}
                           <button 
                              onClick={() => addListItem('dependencies')}
                              className="w-full py-2 bg-white border border-orange-100 rounded-md text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                            >
                              <Plus className="w-3 h-3" /> Add Dependency
                           </button>
                         </div>
                      </div>

                      {/* Edge Cases */}
                      <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                         <h4 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-4 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Edge Cases
                         </h4>
                         <div className="space-y-2">
                           {techAnalysis.edgeCases.map((ec, idx) => (
                             <div key={idx} className="flex gap-2 group">
                               <input 
                                  type="text"
                                  placeholder="Add edge case..."
                                  className="flex-1 bg-white border-red-100 text-slate-700 text-sm rounded-md px-3 py-2 focus:ring-red-200 focus:border-red-300"
                                  value={ec}
                                  onChange={(e) => updateListItem('edgeCases', idx, e.target.value)}
                               />
                               <button 
                                onClick={() => removeListItem('edgeCases', idx)}
                                className="text-red-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                <X className="w-4 h-4" />
                               </button>
                             </div>
                           ))}
                           <button 
                              onClick={() => addListItem('edgeCases')}
                              className="w-full py-2 bg-white border border-red-100 rounded-md text-red-600 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
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
                   <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-xl mb-6 flex items-start gap-3">
                      <FlaskConical className="w-5 h-5 text-teal-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-teal-800">Validation & QA Strategy</h4>
                        <p className="text-sm text-teal-600/80 mt-1">Define the acceptance tests required to verify this feature meets all requirements.</p>
                      </div>
                   </div>

                   {testCases.map((tc, idx) => (
                     <div key={tc.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all">
                        {/* Card Header */}
                        <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                           <div className="flex items-center gap-4 flex-1">
                              <span className="font-mono text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">
                                {tc.id}
                              </span>
                              <input 
                                type="text"
                                placeholder="Test Case Title"
                                className="flex-1 bg-transparent font-semibold text-slate-800 placeholder:text-slate-400 border-none focus:ring-0 p-0"
                                value={tc.title}
                                onChange={(e) => updateTestCase(idx, 'title', e.target.value)}
                              />
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="relative">
                                <select 
                                  value={tc.priority}
                                  onChange={(e) => updateTestCase(idx, 'priority', e.target.value)}
                                  className={`appearance-none pl-3 pr-8 py-1 rounded-md text-xs font-bold uppercase tracking-wide border-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 outline-none
                                    ${tc.priority === 'High' ? 'bg-red-100 text-red-700' : ''}
                                    ${tc.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : ''}
                                    ${tc.priority === 'Low' ? 'bg-blue-100 text-blue-700' : ''}
                                  `}
                                >
                                  <option value="High">High Priority</option>
                                  <option value="Medium">Medium Priority</option>
                                  <option value="Low">Low Priority</option>
                                </select>
                                <ChevronDown className="w-3 h-3 absolute right-2 top-1.5 pointer-events-none opacity-50" />
                              </div>
                              
                              <button 
                                onClick={() => removeTestCase(idx)}
                                className="text-slate-300 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                        
                        {/* Card Body */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                           {/* Pre-conditions */}
                           <div className="md:col-span-1 space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pre-Conditions</label>
                              <textarea 
                                rows={3}
                                className="w-full text-sm bg-slate-50 border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-0 text-slate-600 resize-none p-3"
                                placeholder="- User is logged in&#10;- Data exists"
                                value={tc.preConditions}
                                onChange={(e) => updateTestCase(idx, 'preConditions', e.target.value)}
                              />
                           </div>

                           {/* Steps */}
                           <div className="md:col-span-1 space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Test Steps</label>
                              <textarea 
                                rows={3}
                                className="w-full text-sm bg-slate-50 border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-0 text-slate-600 resize-none p-3"
                                placeholder="1. Go to settings&#10;2. Click save"
                                value={tc.steps}
                                onChange={(e) => updateTestCase(idx, 'steps', e.target.value)}
                              />
                           </div>

                           {/* Expected Result */}
                           <div className="md:col-span-1 space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Expected Result</label>
                              <textarea 
                                rows={3}
                                className="w-full text-sm bg-emerald-50/50 border-transparent rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-0 text-slate-600 resize-none p-3"
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
                      className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-700 hover:shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
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
