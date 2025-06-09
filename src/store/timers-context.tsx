import { createContext, type ReactNode, useContext, useReducer } from "react";

export type Timer = {
    name: string;
    duration: number;
    isActive?: boolean;
}

type TimersState = {
    isRunning: boolean;
    timers: Timer[];
}

const initialState: TimersState = {
    isRunning: true,
    timers: []
}

type TimersContextValue = TimersState & {
    addTimer: (timer: Timer) => void;
    startTimers: () => void;
    stopTimers: () => void;
}

const TimersContext = createContext<TimersContextValue | null>(null);


export function useTimersContext() {
    const context = useContext(TimersContext);
    if (!context) {
        throw new Error("useTimersContext must be used within a TimersContextProvider");
    }
    return context;
}

type StartTimersAction = {
    type: 'START_TIMER';
}

type StopTimersAction = {
    type: 'STOP_TIMER';
}

type AddTimerAction = {
    type: 'ADD_TIMER';
    payload: Timer;
}

type TimersContextProviderProps = {
    children: ReactNode;
}


type Action = StartTimersAction | StopTimersAction | AddTimerAction;


function timersReducer(state: TimersState, action: Action): TimersState {
    if (action.type === 'START_TIMER') {
        return {
            ...state,
            isRunning: true
        };
    }
    if (action.type === 'STOP_TIMER') {
        return {
            ...state,
            isRunning: false
        };
    }
    if (action.type === 'ADD_TIMER') {
        return {
            ...state,
            timers: [
                ...state.timers,
                {
                    name: action.payload.name,
                    duration: action.payload.duration,
                }
            ]
        };
    }
    return state;
}


export default function TimersContextProvider({ children }: TimersContextProviderProps) {
    const [timersState, dispatch] = useReducer(timersReducer, initialState);

    const ctxValue: TimersContextValue = {
        timers: timersState.timers,
        isRunning: timersState.isRunning,

        addTimer: (timerData) => {
            dispatch({ type: 'ADD_TIMER', payload: timerData });
        },
        startTimers: () => {
            dispatch({ type: 'START_TIMER' });
        },
        stopTimers: () => {
            dispatch({ type: 'STOP_TIMER' });
        }
    }
    return (
        <TimersContext.Provider value={ctxValue}>
            {children}
        </TimersContext.Provider>
    )
}