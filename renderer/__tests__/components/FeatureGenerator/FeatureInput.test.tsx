import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeatureInput, { buildDescription } from '../../../components/FeatureGenerator/FeatureInput';

describe('buildDescription', () => {
  it('should combine all filled fields into proper format', () => {
    const testData = {
      purpose: 'To improve user experience',
      description: 'A new dashboard feature',
      users: 'Admin users',
      examples: 'Viewing daily statistics',
      validation: 'Must have proper permissions',
      technicalDetails: 'Uses React components',
      context: 'Part of Q2 improvements'
    };

    const result = buildDescription(testData);
    
    expect(result.description).toBe(
      'Purpose: To improve user experience\n\n' +
      'Description: A new dashboard feature\n\n' +
      'Target Users: Admin users\n\n' +
      'Example Scenarios: Viewing daily statistics\n\n' +
      'Validation Requirements: Must have proper permissions'
    );

    expect(result.context).toBe(
      'Technical Details:\nUses React components\n\n' +
      'Part of Q2 improvements'
    );
  });

  it('should handle minimal required fields', () => {
    const testData = {
      purpose: '',
      description: 'A basic feature',
      users: '',
      examples: '',
      validation: '',
      technicalDetails: '',
      context: ''
    };

    const result = buildDescription(testData);
    
    expect(result.description).toBe('Description: A basic feature');
    expect(result.context).toBe('');
  });

  it('should omit empty optional fields', () => {
    const testData = {
      purpose: 'Main purpose',
      description: 'Feature description',
      users: '',
      examples: 'Some examples',
      validation: '',
      technicalDetails: 'Tech details',
      context: ''
    };

    const result = buildDescription(testData);
    
    expect(result.description).toBe(
      'Purpose: Main purpose\n\n' +
      'Description: Feature description\n\n' +
      'Example Scenarios: Some examples'
    );

    expect(result.context).toBe('Technical Details:\nTech details');
  });
});

describe('FeatureInput Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render all form fields', () => {
    render(<FeatureInput onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/Purpose of Feature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Feature Description\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Users/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Example Scenarios/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Validation Requirements/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Technical Details/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Additional Context/i)).toBeInTheDocument();
  });

  it('should require only description field', () => {
    render(<FeatureInput onSubmit={mockOnSubmit} />);
    
    const descriptionField = screen.getByLabelText(/Feature Description\*/i);
    expect(descriptionField).toHaveAttribute('required');
    
    const otherFields = [
      'Purpose of Feature',
      'Target Users',
      'Example Scenarios',
      'Validation Requirements',
      'Technical Details',
      'Additional Context'
    ].map(label => screen.getByLabelText(new RegExp(label, 'i')));

    otherFields.forEach(field => {
      expect(field).not.toHaveAttribute('required');
    });
  });

  it('should call onSubmit with processed data when form is submitted', () => {
    render(<FeatureInput onSubmit={mockOnSubmit} />);
    
    const descriptionField = screen.getByLabelText(/Feature Description\*/i);
    const purposeField = screen.getByLabelText(/Purpose of Feature/i);
    
    fireEvent.change(descriptionField, { target: { value: 'Test description' } });
    fireEvent.change(purposeField, { target: { value: 'Test purpose' } });
    
    const submitButton = screen.getByText(/Generate User Stories/i);
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      description: 'Purpose: Test purpose\n\nDescription: Test description',
      context: ''
    });
  });
});