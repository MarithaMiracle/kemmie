import 'react-native-gesture-handler';
import './src/styles/index.css';
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import App from './src/app/App';
import { SafeAreaProvider } from 'react-native-safe-area-context';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 20,
    paddingTop: 50,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
    maxHeight: 400,
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#7F1D1D',
    fontFamily: 'monospace',
    fontSize: 14,
  },
});

export default function Root() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
