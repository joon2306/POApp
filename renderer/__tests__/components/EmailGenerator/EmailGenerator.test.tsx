import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailGenerator from '../../../components/EmailGenerator/EmailGenerator';

jest.mock('../../../services/impl/EmailGeneratorService', () => {
  return jest.fn().mockImplementation(() => ({
    generateEmail: jest.fn().mockResolvedValue({
      error: false,
      result: {
        content: 'Corrected email content',
        subject: 'Suggested subject'
      }
    })
  }));
});

describe('EmailGenerator', () => {
  it('should render email form initially', () => {
    render(<EmailGenerator />);
    expect(screen.getByText('Email Generator')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should show correction result after generating email', async () => {
    render(<EmailGenerator />);
    
    // Fill and submit the form
    const textarea = screen.getByLabelText('Email*');
    fireEvent.change(textarea, { target: { value: 'Test email content' } });
    fireEvent.click(screen.getByText('Correct Email'));

    // Wait for the correction result to appear
    await waitFor(() => {
      expect(screen.getByText('Corrected Email')).toBeInTheDocument();
    });
    
    // Verify both buttons are present and correctly positioned
    const buttons = screen.getAllByRole('button');
    expect(buttons[buttons.length - 2]).toHaveTextContent('Reset');
    expect(buttons[buttons.length - 1]).toHaveTextContent('Open in Outlook');
  });

  it('should reset form and remove correction result when clicking reset', async () => {
    render(<EmailGenerator />);
    
    // Fill and submit the form
    const originalTextarea = screen.getByLabelText('Email*');
    fireEvent.change(originalTextarea, { target: { value: 'Test email content' } });
    fireEvent.click(screen.getByText('Correct Email'));

    // Wait for the correction result to appear
    await waitFor(() => {
      expect(screen.getByText('Corrected Email')).toBeInTheDocument();
    });

    // Click reset button
    fireEvent.click(screen.getByText('Reset'));

    // Verify correction result is removed
    expect(screen.queryByText('Corrected Email')).not.toBeInTheDocument();

    // Verify the form is reset
    const resetTextarea = screen.getByLabelText('Email*');
    expect(resetTextarea).toHaveValue('');
  });
});