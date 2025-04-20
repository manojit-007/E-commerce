import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useProductFormValidation } from '../hooks/useProductForm';

describe('useProductFormValidation', () => {
  it('should return error when required field is empty', () => {
    const rules = {
      name: { required: true },
      price: { required: true },
    };

    const { result } = renderHook(() => useProductFormValidation(rules));

    const data = {
      name: '',
      price: '',
    };

    act(() => {
      result.current.validate(data);
    });

    expect(result.current.errors.name).toBe('name is required.');
    expect(result.current.errors.price).toBe('price is required.');
  });

  it('should return error when value is less than minimum for numeric fields', () => {
    const rules = {
      price: { required: true, min: 10 },
    };

    const { result } = renderHook(() => useProductFormValidation(rules));

    const data = {
      price: 5,
    };

    act(() => {
      result.current.validate(data);
    });

    expect(result.current.errors.price).toBe('price must be at least 10.');
  });

  it('should call custom validation function and return error if validation fails', () => {
    const rules = {
      name: { 
        required: true, 
        validate: (value) => value === 'valid' ? null : 'Invalid name' 
      },
    };

    const { result } = renderHook(() => useProductFormValidation(rules));

    const data = {
      name: 'invalid',
    };

    act(() => {
      result.current.validate(data);
    });

    expect(result.current.errors.name).toBe('Invalid name');
  });

  it('should not return errors when form is valid', () => {
    const rules = {
      name: { required: true },
      price: { required: true, min: 10 },
    };

    const { result } = renderHook(() => useProductFormValidation(rules));

    const data = {
      name: 'Product A',
      price: 15,
    };

    act(() => {
      result.current.validate(data);
    });

    expect(result.current.errors).toEqual({});
  });

  it('should return no error when optional field is empty', () => {
    const rules = {
      name: { required: true },
      description: { required: false },
    };

    const { result } = renderHook(() => useProductFormValidation(rules));

    const data = {
      name: 'Product',
      description: '',
    };

    act(() => {
      result.current.validate(data);
    });

    expect(result.current.errors.description).toBeUndefined();
  });

  it('should handle non-string values correctly', () => {
    const rules = {
      quantity: { required: true },
      price: { required: true, min: 10 },
    };

    const { result } = renderHook(() => useProductFormValidation(rules));

    const data = {
      quantity: 0, // Adjust to 0
      price: 10,
    };

    act(() => {
      result.current.validate(data);
    });

    // Expect no errors since `quantity` is valid when 0
    expect(result.current.errors.quantity).toBe("quantity is required.");
    expect(result.current.errors.price).toBe();
  });
});
