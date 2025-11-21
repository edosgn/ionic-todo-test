/**
 * Application Layer - Common Use Case Interfaces
 * 
 * Common interfaces and types used across all use cases in the application layer.
 * These provide consistency and type safety for use case implementations.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { Observable } from 'rxjs';

/**
 * Generic use case interface that all use cases should implement
 * 
 * @template TInput - The input type for the use case
 * @template TOutput - The output type for the use case
 */
export interface UseCase<TInput = void, TOutput = void> {
  /**
   * Executes the use case with the given input
   * 
   * @param input - The input parameters for the use case
   * @returns Observable that emits the result of the use case
   */
  execute(input?: TInput): Observable<TOutput>;
}

/**
 * Use case that doesn't require input parameters
 * 
 * @template TOutput - The output type for the use case
 */
export interface NoInputUseCase<TOutput> extends UseCase<void, TOutput> {
  execute(): Observable<TOutput>;
}

/**
 * Use case that doesn't return any value (void operations)
 * 
 * @template TInput - The input type for the use case
 */
export interface VoidUseCase<TInput> extends UseCase<TInput, void> {
  execute(input: TInput): Observable<void>;
}

/**
 * Use case that neither takes input nor returns output
 */
export interface NoInputVoidUseCase extends UseCase<void, void> {
  execute(): Observable<void>;
}

/**
 * Result wrapper for operations that might fail
 * 
 * @template TData - The type of successful result data
 * @template TError - The type of error information
 */
export interface Result<TData, TError = Error> {
  /** Whether the operation was successful */
  success: boolean;
  
  /** The result data (only present when success is true) */
  data?: TData;
  
  /** The error information (only present when success is false) */
  error?: TError;
  
  /** Optional message providing additional context */
  message?: string;
}

/**
 * Pagination input parameters
 */
export interface PaginationInput {
  /** Page number (1-based) */
  page: number;
  
  /** Number of items per page */
  limit: number;
  
  /** Optional sorting field */
  sortBy?: string;
  
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Paginated result wrapper
 * 
 * @template T - The type of items in the paginated result
 */
export interface PaginatedResult<T> {
  /** The items for the current page */
  items: T[];
  
  /** Current page number (1-based) */
  currentPage: number;
  
  /** Total number of pages */
  totalPages: number;
  
  /** Total number of items across all pages */
  totalItems: number;
  
  /** Number of items per page */
  itemsPerPage: number;
  
  /** Whether there are more pages after the current one */
  hasNextPage: boolean;
  
  /** Whether there are pages before the current one */
  hasPreviousPage: boolean;
}

/**
 * Search input parameters
 */
export interface SearchInput {
  /** Search query string */
  query: string;
  
  /** Fields to search in (optional, searches all by default) */
  fields?: string[];
  
  /** Whether the search should be case sensitive */
  caseSensitive?: boolean;
  
  /** Whether to use exact match or partial match */
  exactMatch?: boolean;
}

/**
 * Filter input parameters for generic filtering
 */
export interface FilterInput {
  /** Field to filter by */
  field: string;
  
  /** Operator for the filter */
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  
  /** Value to filter by */
  value: any;
}

/**
 * Combined search and filter input
 */
export interface SearchAndFilterInput {
  /** Search parameters (optional) */
  search?: SearchInput;
  
  /** Filter parameters (optional) */
  filters?: FilterInput[];
  
  /** Pagination parameters (optional) */
  pagination?: PaginationInput;
}

/**
 * Base error class for all use case errors
 */
export class UseCaseError extends Error {
  public readonly timestamp: Date;
  
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any,
    public readonly innerError?: Error
  ) {
    super(message);
    this.name = 'UseCaseError';
    this.timestamp = new Date();
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UseCaseError);
    }
  }
}

/**
 * Error for validation failures
 */
export class ValidationError extends UseCaseError {
  constructor(
    field: string,
    value: any,
    reason: string,
    details?: any
  ) {
    super(
      `Validation failed for field "${field}": ${reason}`,
      'VALIDATION_ERROR',
      { field, value, reason, ...details }
    );
    this.name = 'ValidationError';
  }
}

/**
 * Error for resource not found scenarios
 */
export class NotFoundError extends UseCaseError {
  constructor(
    resource: string,
    identifier: string,
    details?: any
  ) {
    super(
      `${resource} with identifier "${identifier}" not found`,
      'NOT_FOUND_ERROR',
      { resource, identifier, ...details }
    );
    this.name = 'NotFoundError';
  }
}

/**
 * Error for unauthorized access
 */
export class UnauthorizedError extends UseCaseError {
  constructor(
    operation: string,
    details?: any
  ) {
    super(
      `Unauthorized to perform operation: ${operation}`,
      'UNAUTHORIZED_ERROR',
      { operation, ...details }
    );
    this.name = 'UnauthorizedError';
  }
}

/**
 * Error for business rule violations
 */
export class BusinessRuleError extends UseCaseError {
  constructor(
    rule: string,
    details?: any
  ) {
    super(
      `Business rule violation: ${rule}`,
      'BUSINESS_RULE_ERROR',
      { rule, ...details }
    );
    this.name = 'BusinessRuleError';
  }
}