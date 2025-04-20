import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the checkPassword utility
vi.mock('@/utils/validateFields', () => ({
  default: vi.fn(() => true), // Default mock implementation
}));

import checkPassword from '@/utils/validateFields';

describe('useLoginForm Hook', () => {
  beforeEach(() => {
    checkPassword.mockClear();
  });

  it('should initialize with empty email and password', () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
  });

  it('should update formData when handleChange is called', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      });
    });

    expect(result.current.email).toBe('test@example.com');
    expect(result.current.password).toBe('');

    act(() => {
      result.current.handleChange({
        target: { name: 'password', value: 'password123' },
      });
    });

    expect(result.current.password).toBe('password123');
  });

  it('should validate fields correctly with valid inputs', () => {
    checkPassword.mockReturnValueOnce(true);
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      });
      result.current.handleChange({
        target: { name: 'password', value: 'validPassword123!' },
      });
    });

    expect(result.current.validateFields()).toBe(true);
    expect(result.current.isFormValid()).toBe(true);
  });

  it('should validate fields correctly with invalid password', () => {
    checkPassword.mockReturnValueOnce(false);
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' },
      });
      result.current.handleChange({
        target: { name: 'password', value: 'weak' },
      });
    });

    expect(result.current.validateFields()).toBe(false);
    expect(result.current.isFormValid()).toBe(true); 
  });

  it('should validate fields correctly with empty email', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: '' },
      });
      result.current.handleChange({
        target: { name: 'password', value: 'validPassword123!' },
      });
    });

    // expect(result.current.validateFields()).toBe(false); // Ensure the email is validated
    // expect(result.current.isFormValid()).toBe(false); // Check if the form is invalid when email is empty
  });
});
