import React from 'react';

const Todo = () => {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border rounded-xl px-3 py-1.5 w-full">
                <div className="flex items-center w-full">
                    <div className="w-full text-sm">Multi Select</div>
                    <button
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
                             stroke-linecap="round"
                             stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                            <path d="m15 5 4 4"></path>
                        </svg>
                    </button>
                    <button
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
                             stroke-linecap="round"
                             stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line x1="10" x2="10" y1="11" y2="17"></line>
                            <line x1="14" x2="14" y1="11" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Todo;