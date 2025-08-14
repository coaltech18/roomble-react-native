import React, { useState } from 'react';
import { AppProvider } from '@/AppProvider';
import { RootNavigator } from '@/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppLoading } from '@/components/AppLoading';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        {isLoading ? (
          <AppLoading onLoadingComplete={handleLoadingComplete} />
        ) : (
          <RootNavigator />
        )}
      </AppProvider>
    </GestureHandlerRootView>
  );
}
