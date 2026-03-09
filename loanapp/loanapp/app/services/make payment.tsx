import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform,ScrollView,StatusBar} from 'react-native';
import { ArrowLeft, HelpCircle, Wallet, CreditCard, ChevronRight, Lock,Home,LayoutGrid,User} from 'lucide-react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';

const LoanPaymentForm = () => {
  const { accountNumber, emidue } = useLocalSearchParams<{
    accountNumber?: string;
    emidue?: string;
  }>();
  const router = useRouter();
  const [accountNumberValue, setAccountNumberValue] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (typeof accountNumber === 'string') {
      setAccountNumberValue(accountNumber);
    }
  }, [accountNumber]);

  useEffect(() => {
    if (typeof emidue === 'string' && emidue) {
      setAmount(emidue);
    }
  }, [emidue]);

  const handleSubmitPayment = () => {
    if (!accountNumberValue || !amount) {
      return;
    }

    router.push({
      pathname: '/services/payment sucess',
      params: {
        accountNumber: accountNumberValue,
        amount,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.replace('/services')}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#0f172a" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loan Payment</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.main}>
          <View style={styles.intro}>
            <Text style={styles.title}>Make a Payment</Text>
            <Text style={styles.subtitle}>Please enter your loan account details and the EMI amount to proceed.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}><Wallet size={16} /> Account Number</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter 12-digit account number" 
                keyboardType="numeric"
                value={accountNumberValue}
                onChangeText={setAccountNumberValue}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}><CreditCard size={16} /> EMI Amount</Text>
              <TextInput 
                style={styles.input} 
                placeholder="0.00" 
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
            
            
            <View style={styles.summaryBox}>
              <View style={styles.row}><Text>Processing Fee</Text><Text>$0.00</Text></View>
              <View style={styles.row}><Text style={styles.bold}>Total Payable</Text><Text style={styles.primaryText}>${amount || '0.00'}</Text></View>
            </View>
            
            <TouchableOpacity onPress={handleSubmitPayment} style={styles.submitButton}> 
              <Text style={styles.submitText}>Submit Payment</Text>
              <ChevronRight color="white" size={20} />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        
      </View>
    </SafeAreaView>
  );
};

interface FooterItemProps {
  icon: React.ReactElement<{ color?: string }>;
  label: string;
  active?: boolean;
}
const FooterItem = ({ icon, label, active }:FooterItemProps) => (
  <TouchableOpacity style={styles.footerItem}>
    {React.cloneElement(icon, { color: active ? '#136dec' : '#64748b' })}
    <Text style={[styles.footerLabel, active && { color: '#136dec' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  main: { padding: 16 },
  intro: { marginBottom: 32 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#64748b', marginTop: 8 },
  card: { backgroundColor: 'white', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  field: { marginBottom: 20 },
  label: { fontWeight: '600', marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  input: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  summaryBox: { backgroundColor: '#eff6ff', padding: 16, borderRadius: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  bold: { fontWeight: 'bold' },
  primaryText: { color: '#136dec', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#136dec', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  submitText: { color: 'white', fontWeight: 'bold', marginRight: 8 },
  securityBadge: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  securityText: { color: '#94a3b8', fontSize: 12 },
  footer: { flexDirection: 'row', padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#e2e8f0' },
  footerItem: { flex: 1, alignItems: 'center' },
  footerLabel: { fontSize: 10, marginTop: 4, color: '#64748b' },
  iconButton: { padding: 8,borderRadius: 20,justifyContent: 'center',alignItems: 'center' },
});

export default LoanPaymentForm;