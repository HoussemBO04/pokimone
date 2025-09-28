"use client";
import React from "react";
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
};
export default StoreProvider;
