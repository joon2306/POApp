"use client"

import { useState } from 'react';
import Head from 'next/head';
import FeatureInput from './FeatureInput';
import GeneratedOutput from './GeneratedOutput';
import FeedbackForm from './FeedbackForm';
import FinalReport from './FinalReport';
import FeatureInputType from '../../types/FeatureGenerator/FeatureInput';
import { AiResponse, Content } from '../../types/FeatureGenerator/FinalReport';
import { FeedbackFormType } from '../../types/FeatureGenerator/FeedbackForm';
import { IFeatureGeneratorService } from '../../services/IFeatureGeneratorService';
import { FeatureGeneratorService } from '../../services/impl/FeatureGeneratorService';


export default function FeatureGenerator() {
  const [stage, setStage] = useState<'input' | 'review' | 'refine' | 'final'>('input');
  const [featureData, setFeatureData] = useState<FeatureInputType>({ description: '', context: '' });
  const [generatedContent, setGeneratedContent] = useState<Content>({
    userStories: [],
    acceptanceCriteria: {},
    estimates: {},
    questions: []
  });
  const [feedback, setFeedback] = useState<string>('');
  const [iterations, setIterations] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [featureSummary, setFeatureSummary] = useState<{ summary: string; benefitHypothesis: string }>({ summary: "", benefitHypothesis: "" });

  const featureGeneratorService: IFeatureGeneratorService = new FeatureGeneratorService();
  const handleFeatureSubmit = async (data: FeatureInputType) => {
    if (!data.context) {
      data.context = "No Additional Context";
    }
    setFeatureData(data);
    setIsLoading(true);

    try {
      const response: AiResponse = await featureGeneratorService.generateFeature(data);
      console.log("response: ", JSON.stringify(response));

      if (response.error) {
        throw new Error("Failure to generate content");
      }
      setGeneratedContent(response.result);
      setStage('review');
      setIterations(1);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedbackData: FeedbackFormType) => {
    setFeedback(feedbackData.feedback);
    setIsLoading(true);

    try {
      if (!feedbackData.isApproved) {
        const response = await fetch('/api/refine', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            feature: featureData,
            currentContent: generatedContent,
            feedback: feedbackData.feedback,
            iterations: iterations
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to refine content');
        }

        const result = await response.json();
        if (result.error) {
          throw new Error("Failure to refine content");
        }
        setGeneratedContent(result.result);
        setIterations(iterations + 1);
      }

      if (feedbackData.isApproved) {
        await generateFeatureSummary();
        setStage('final');
      } else {
        setStage('refine');
      }
    } catch (error) {
      console.error('Error refining content:', error);
      alert('Failed to refine content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateFeatureSummary = async () => {
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feature: featureData,
          currentContent: generatedContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const result = await response.json();
      if (result.error) {
        throw new Error("Failure to generate content");
      }
      setFeatureSummary(result.result);

    } catch (error) {
      console.error('Error refining content:', error);
      alert('Failed to generate summary.');
    }
  }

  const handleReset = () => {
    setStage('input');
    setFeatureData({ description: '', context: '' });
    setGeneratedContent({ userStories: [], acceptanceCriteria: {}, estimates: {}, questions: [] });
    setFeedback('');
    setIterations(0);
    setFeatureSummary({ summary: "", benefitHypothesis: "" });
  };

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Feature Generator</title>
        <meta name="description" content="Generate user stories and requirements using AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{color: "black"}}>Feature Generator</h1>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg">Processing your request...</p>
              <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {stage === 'input' && (
          <FeatureInput onSubmit={handleFeatureSubmit} />
        )}

        {(stage === 'review' || stage === 'refine') && (
          <>
            <GeneratedOutput content={generatedContent} iteration={iterations} />
            <FeedbackForm onSubmit={handleFeedbackSubmit} previousFeedback={feedback} />
          </>
        )}

        {stage === 'final' && (
          <FinalReport
            content={generatedContent}
            feature={featureData}
            iterations={iterations}
            featureSummary={featureSummary}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}