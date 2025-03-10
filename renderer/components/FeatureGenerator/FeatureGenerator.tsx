"use client"

import { useState } from 'react';
import Head from 'next/head';
import FeatureInput from './FeatureInput';
import GeneratedOutput from './GeneratedOutput';
import FeedbackForm from './FeedbackForm';
import FinalReport from './FinalReport';
import FeatureInputType from '../../types/FeatureGenerator/FeatureInput';
import { AiResponse, Content, SummaryFeatureProps } from '../../types/FeatureGenerator/FinalReport';
import { FeedbackFormType } from '../../types/FeatureGenerator/FeedbackForm';
import { IFeatureGeneratorService } from '../../services/IFeatureGeneratorService';
import { FeatureGeneratorService } from '../../services/impl/FeatureGeneratorService';
import Loading from '../Loading';


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
  const [featureSummary, setFeatureSummary] = useState<SummaryFeatureProps>({ summary: "", benefitHypothesis: "" });

  const featureGeneratorService: IFeatureGeneratorService = new FeatureGeneratorService();
  const handleFeatureSubmit = async (data: FeatureInputType) => {
    if (!data.context) {
      data.context = "No Additional Context";
    }
    setFeatureData(data);
    setIsLoading(true);

    try {
      const response: AiResponse = await featureGeneratorService.generateFeature(data);

      if (response.error) {
        throw new Error("Failure to generate content");
      }
      setGeneratedContent(response.result as Content);
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
        const response: AiResponse = await featureGeneratorService.refineFeature({
          feature: featureData,
          currentContent: generatedContent,
          feedback: feedbackData.feedback,
          iterations: iterations
        });

        if (response.error) {
          throw new Error("Failure to refine content");
        }
        setGeneratedContent(response.result as Content);
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

      const data = {
        feature: featureData,
        currentContent: generatedContent
      };
      const response: AiResponse = await featureGeneratorService.summaryFeature(data);

      if (response.error) {
        throw new Error("Failure to refine content");
      }

      setFeatureSummary(response.result as SummaryFeatureProps);

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
        <meta name="description" content="Generate user stories and requirements using AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: "black" }}>Feature Generator</h1>

        {isLoading && (
          <Loading/>
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