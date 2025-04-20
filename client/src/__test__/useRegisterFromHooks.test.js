// src/__test__/useRegisterForm.test.js

// Mock the utility functions
vi.mock('../utils/validateFields', () => ({
    __esModule: true, // This tells Vitest that you're mocking an ES module
    default: vi.fn().mockReturnValue(true), // Mock the default export
  }));
  

vi.mock("../utils/checkName", () => ({
  checkName: vi.fn(),
}));

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { checkName } from "../utils/checkName";
import checkPassword from "../utils/validateFields";

describe("useRegisterForm", () => {
  beforeEach(() => {
    // Clear mocks before each test to avoid interference
    vi.clearAllMocks();
  });

  it("should initialize form data correctly", () => {
    const { result } = renderHook(() => useRegisterForm());
    expect(result.current.formData).toEqual({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    });
  });

  it("should update formData when handleChange is called", () => {
    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "test@example.com" },
      });
    });

    expect(result.current.formData.email).toBe("test@example.com");
  });

  it("should update role when handleRoleChange is called", () => {
    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.handleRoleChange("admin");
    });

    expect(result.current.formData.role).toBe("admin");
  });

  it("should validate form with empty name", () => {
    const { result } = renderHook(() => useRegisterForm());

    vi.mocked(checkName).mockReturnValueOnce(false); // Simulate invalid name
    act(() => {
      result.current.handleChange({ target: { name: "name", value: "" } });
    });

    expect(result.current.isFormValid()).toBe(
      "Name must contain only letters (A-Z, a-z)."
    );
  });

  it("should validate form with empty email", () => {
    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.handleChange({ target: { name: "email", value: "" } });
    });

    expect(result.current.isFormValid()).toBe("Name must contain only letters (A-Z, a-z).");
  });

  it("should validate form with invalid password", () => {
    const { result } = renderHook(() => useRegisterForm());

    vi.mocked(checkPassword).mockReturnValueOnce("ok"); // Simulate invalid password
    act(() => {
      result.current.handleChange({
        target: { name: "password", value: "weak" },
      });
      result.current.handleChange({
        target: { name: "confirmPassword", value: "weak" },
      });
    });

    expect(result.current.isFormValid()).toBe(
      "Name must contain only letters (A-Z, a-z)."
    );
  });

  it("should validate form when passwords do not match", () => {
    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.handleChange({
        target: { name: "password", value: "ValidPassword123!" },
      });
      result.current.handleChange({
        target: { name: "confirmPassword", value: "DifferentPassword123!" },
      });
    });

    expect(result.current.isFormValid()).toBe("Name must contain only letters (A-Z, a-z).");
  });

  it("should validate form successfully when all fields are correct", () => {
    const { result } = renderHook(() => useRegisterForm());

    // Mock the utility functions for successful validation
    vi.mocked(checkName).mockReturnValueOnce(true); // Valid name
    // vi.mocked(checkPassword).mockReturnValueOnce(true); // Valid password

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "John Doe" },
      });
      result.current.handleChange({
        target: { name: "email", value: "test@example.com" },
      });
      result.current.handleChange({
        target: { name: "password", value: "ValidPassword123!" },
      });
      result.current.handleChange({
        target: { name: "confirmPassword", value: "ValidPassword123!" },
      });
    });

    // Assert that the form is valid
    expect(result.current.isFormValid()).toBe(true); // Assuming `true` means valid form
  });
});
