import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, ImageBackground, Platform } from 'react-native';
import { AlignCenterHorizontal, Check } from 'lucide-react-native';
import { Link, useLocalSearchParams } from 'expo-router';

const PaymentConfirmationScreen = () => {
  const { amount, accountNumber } = useLocalSearchParams<{ amount?: string; accountNumber?: string }>();
  const paidAmount = amount || '0.00';
  const account = accountNumber || 'N/A';
  const date = new Date().toLocaleDateString();

  const handleDownloadReceipt = () => {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <h1>Payment Receipt</h1>
          <p>Thank you for your payment.</p>
          <table style="border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 4px 8px; font-weight: bold;">Account Number</td>
              <td style="padding: 4px 8px;">${account}</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px; font-weight: bold;">Amount Paid</td>
              <td style="padding: 4px 8px;">$${paidAmount}</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px; font-weight: bold;">Date</td>
              <td style="padding: 4px 8px;">${date}</td>
            </tr>
          </table>
        </body>
      </html>
    `;

    if (Platform.OS === 'web') {
      const receiptWindow = window.open('', '_blank');
      if (!receiptWindow) return;
      receiptWindow.document.write(html);
      receiptWindow.document.close();
      receiptWindow.focus();
      receiptWindow.print();
    } else {
     
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Payment Confirmation</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <View style={styles.glow} />
          <View style={styles.checkIcon}>
            <Check color="white" size={48} strokeWidth={3} />
          </View>
        </View>

        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.subtitle}>
          Your loan payment has been processed successfully. A confirmation email has been sent to your registered address.
        </Text>

        <View style={styles.detailsCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Amount Paid</Text>
            <Text style={styles.valueLarge}>${paidAmount}</Text>
          </View>
          <View style={styles.divider} />
          <DetailRow label="Account Number" value={account} />
          <DetailRow label="Date" value={date} />
        </View>
      </View>

      <View style={styles.footer}>
        <Link href={"/services"} style={styles.primaryButton}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </Link>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleDownloadReceipt}>
          <Text style={styles.secondaryButtonText}>Download Receipt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

type detailrowProps = {
  label: string;
  value: string;
};
const DetailRow = ({ label, value }:detailrowProps) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 32 },
  iconWrapper: { marginBottom: 32, position: 'relative' },
  glow: { position: 'absolute', width: 96, height: 96, borderRadius: 48, backgroundColor: '#136dec', opacity: 0.2 },
  checkIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#136dec', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },
  detailsCard: { width: '100%', backgroundColor: '#f8fafc', borderRadius: 16, padding: 20, marginTop: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 8 },
  label: { fontSize: 14, color: '#64748b' },
  value: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  valueLarge: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
    alignItems: 'stretch',
  },
  primaryButton: {
    backgroundColor: '#136dec',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#e2e8f0', padding: 16, borderRadius: 12, alignItems: 'center' },
  secondaryButtonText: { color: '#334155', fontWeight: '600', fontSize: 16 }
});

export default PaymentConfirmationScreen;