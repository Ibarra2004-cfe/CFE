import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ServiceRecord } from '../../types/service_records/service_record';

interface ServiceRecordsState {
    records: ServiceRecord[];
    currentRecord: ServiceRecord | null;
    loading: boolean;
    error: string | null;
}

type ServiceRecordsAction =
    | { type: 'FETCH_RECORDS_START' }
    | { type: 'FETCH_RECORDS_SUCCESS'; payload: ServiceRecord[] }
    | { type: 'FETCH_RECORDS_ERROR'; payload: string }
    | { type: 'SET_CURRENT_RECORD'; payload: ServiceRecord | null }
    | { type: 'ADD_RECORD'; payload: ServiceRecord }
    | { type: 'UPDATE_RECORD'; payload: ServiceRecord }
    | { type: 'DELETE_RECORD'; payload: number };

const initialState: ServiceRecordsState = {
    records: [],
    currentRecord: null,
    loading: false,
    error: null,
};

function serviceRecordsReducer(state: ServiceRecordsState, action: ServiceRecordsAction): ServiceRecordsState {
    switch (action.type) {
        case 'FETCH_RECORDS_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_RECORDS_SUCCESS':
            return { ...state, loading: false, records: action.payload };
        case 'FETCH_RECORDS_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'SET_CURRENT_RECORD':
            return { ...state, currentRecord: action.payload };
        case 'ADD_RECORD':
            return { ...state, records: [...state.records, action.payload] };
        case 'UPDATE_RECORD':
            return {
                ...state,
                records: state.records.map((r) => (r.id === action.payload.id ? action.payload : r)),
                currentRecord: state.currentRecord?.id === action.payload.id ? action.payload : state.currentRecord,
            };
        case 'DELETE_RECORD':
            return {
                ...state,
                records: state.records.filter((r) => r.id !== action.payload),
            };
        default:
            return state;
    }
}

interface ServiceRecordsContextType extends ServiceRecordsState {
    dispatch: React.Dispatch<ServiceRecordsAction>;
}

const ServiceRecordsContext = createContext<ServiceRecordsContextType | undefined>(undefined);

export function ServiceRecordsProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(serviceRecordsReducer, initialState);

    return (
        <ServiceRecordsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ServiceRecordsContext.Provider>
    );
}

export function useServiceRecords() {
    const context = useContext(ServiceRecordsContext);
    if (context === undefined) {
        throw new Error('useServiceRecords must be used within a ServiceRecordsProvider');
    }
    return context;
}
