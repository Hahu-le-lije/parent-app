import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChildrenStore } from '@/store/childrenStore';

const ChildDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();


  const children = useChildrenStore((state) => state.children);
  const loading = useChildrenStore((state) => state.loading);
  const lastPurchasedPlan = useChildrenStore((state) => state.lastPurchasedPlan);
  const assignLastPurchasedToChild = useChildrenStore(
    (state) => state.assignLastPurchasedToChild,
  );
  const deleteChild = useChildrenStore((state) => state.deleteChild);

  const child = useMemo(
    () => children.find((c) => c._id === String(id)),
    [children, id]
  );

  const handleAssignPlan = () => {
    if (!child) return;
    assignLastPurchasedToChild(child._id);
  };

  const handleDeleteChild = () => {
    if (!child) return;

    Alert.alert(
      'Delete child',
      `Are you sure you want to remove ${child.name} from your children list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteChild(child._id);
            router.replace('/(root)/(tabs)/children');
          },
        },
      ],
    );
  };

  if (!child && loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading child details...</Text>
      </SafeAreaView>
    );
  }

  if (!child) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorTitle}>Child not found</Text>
        <Text style={styles.errorText}>
          Please go back to the children list and try again.
        </Text>
        <TouchableOpacity
          style={styles.backToListButton}
          onPress={() => router.replace('/(root)/(tabs)/children')}
        >
          <Text style={styles.backToListButtonText}>Back to Children</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const subscriptionActive = child.paid && child.subscription !== 'None';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextGroup}>
            <Text style={styles.headerTitle}>Child details</Text>
            <Text style={styles.headerSubtitle}>{child.name}</Text>
          </View>
        </View>

        <View style={styles.profileRow}>
          <Image source={{ uri: child.image }} style={styles.avatar} />
          <View>
            <Text style={styles.childName}>{child.name}</Text>
            <Text style={styles.childMeta}>Age {child.age}</Text>
            <Text style={styles.childMeta}>
              Subscription: {child.subscription || 'None'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Current Subscription</Text>
          <Text style={styles.sectionBody}>
            Status:{' '}
            <Text
              style={[
                styles.statusPill,
                subscriptionActive ? styles.statusActive : styles.statusInactive,
              ]}
            >
              {subscriptionActive ? 'Active' : 'No active plan'}
            </Text>
          </Text>
          <Text style={styles.sectionBody}>
            Plan:{' '}
            <Text style={styles.highlight}>
              {child.subscription || 'Not assigned'}
            </Text>
          </Text>
        </View>

        {lastPurchasedPlan && (
          <View style={styles.assignCard}>
            <Text style={styles.assignTitle}>New plan purchased</Text>
            <Text style={styles.assignBody}>
              You recently bought{' '}
              <Text style={styles.assignHighlight}>
                {lastPurchasedPlan.name}
              </Text>
              . You can assign it to {child.name}.
            </Text>
            <TouchableOpacity
              style={styles.assignButton}
              onPress={handleAssignPlan}
            >
              <Text style={styles.assignButtonText}>Assign to this child</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Learning Snapshot</Text>
          <Text style={styles.sectionBody}>
            This is a preview of how {child.name}&apos;s skills could look once
            connected to your backend. Values below are placeholder analytics.
          </Text>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Reading</Text>
            <Text style={styles.metricValue}>82%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '82%' }]} />
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Listening</Text>
            <Text style={styles.metricValue}>74%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '74%' }]} />
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Speaking</Text>
            <Text style={styles.metricValue}>68%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '68%' }]} />
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Writing</Text>
            <Text style={styles.metricValue}>90%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '90%' }]} />
          </View>

          <Text style={[styles.sectionBody, { marginTop: 10 }]}>
            You can later drive these numbers from real progress data (e.g. per
            activity or per level) and expand this section with charts or
            history.
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.85}
            onPress={handleDeleteChild}
          >
            <Text style={styles.deleteButtonText}>Delete child</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChildDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
  },
  header: {
    height: 190,
    paddingHorizontal: 20,
    paddingBottom: 16,
    justifyContent: 'flex-end',
    backgroundColor: '#111827',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  backIcon: {
    color: '#F9FAFB',
    fontSize: 18,
    marginTop: -1,
  },
  headerTextGroup: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#F9FAFB',
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#E5E7EB',
    opacity: 0.9,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#e0e0e0',
  },
  childName: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  childMeta: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#E5E7EB',
    opacity: 0.9,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#26264A',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#D1D5DB',
    lineHeight: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  metricLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#E5E7EB',
  },
  metricValue: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#A5B4FC',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#1F2937',
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#3B82F6',
  },
  statusPill: {
    fontFamily: 'Poppins-SemiBold',
  },
  statusActive: {
    color: '#4ADE80',
  },
  statusInactive: {
    color: '#FCA5A5',
  },
  highlight: {
    fontFamily: 'Poppins-SemiBold',
    color: '#60A5FA',
  },
  assignCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  assignTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  assignBody: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#ECFDF5',
    marginBottom: 10,
  },
  assignHighlight: {
    fontFamily: 'Poppins-Bold',
  },
  assignButton: {
    marginTop: 4,
    backgroundColor: '#065F46',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  assignButtonText: {
    color: '#ECFDF5',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  actionsRow: {
    marginTop: 8,
    marginBottom: 8,
  },
  deleteButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.9)',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(153,27,27,0.15)',
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FCA5A5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F1F39',
  },
  loadingText: {
    marginTop: 12,
    color: '#E5E7EB',
    fontFamily: 'Poppins-Regular',
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FCA5A5',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#E5E7EB',
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  backToListButton: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
  },
  backToListButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});

