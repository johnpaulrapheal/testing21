import React, { useEffect, useState } from "react";
import {ActivityIndicator,StyleSheet,View,Text,ScrollView,TouchableOpacity,SafeAreaView,StatusBar,} from "react-native";
import { Calendar, Fingerprint, Percent, Clock, CreditCard, Wallet } from "lucide-react-native";
import { Link } from "expo-router";
import { getCustomers } from "./api";

type Customer = {
  id: number;
  accountnumber: number;
  issuedate: string;
  interestrate: string;
  tenure: number;
  emidue: number;
};

const LoanDetailsScreen = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await getCustomers();
        const allCustomers: Customer[] = res.data;
        const target = allCustomers.find(
          (customer) => customer.accountnumber === 1001
        );
        setCustomers(target ? [target] : []);
      } catch {
        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loan Details</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {customers.map((customer) => (
          <View key={customer.id} style={styles.customerCard}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryLabel}>TOTAL OUTSTANDING</Text>
                <Text style={styles.summaryAmount}>
                  ${(Number(customer.emidue) * customer.tenure).toFixed(2)}
                </Text>
                <View style={styles.badge}>
                  <Calendar color="rgba(255,255,255,0.8)" size={14} />
                  <Text style={styles.badgeText}>EMI Due</Text>
                </View>
              </View>
              <View style={styles.bgIconContainer}>
                <Wallet color="white" size={100} opacity={0.1} />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Loan Information</Text>

            <InfoItem
              icon={<Fingerprint color="#136dec" size={20} />}
              label="Account Number"
              value={`LN-${customer.accountnumber}`}
            />
            <InfoItem
              icon={<Calendar color="#136dec" size={20} />}
              label="Issue Date"
              value={new Date(customer.issuedate).toLocaleDateString()}
            />
            <InfoItem
              icon={<Percent color="#136dec" size={20} />}
              label="Interest Rate"
              value={`${customer.interestrate}% Fixed`}
            />
            <InfoItem
              icon={<Clock color="#136dec" size={20} />}
              label="Tenure"
              value={`${customer.tenure} Months`}
            />

            <View style={[styles.infoCard, styles.emiCard]}>
              <View style={styles.emiIconBox}>
                <CreditCard color="white" size={20} />
              </View>
              <View>
                <Text style={styles.emiLabel}>EMI DUE</Text>
                <Text style={styles.emiAmount}>${customer.emidue}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Link
        href={{
          pathname: "/services/make payment",
          params: {
            accountNumber:
              customers[0]?.accountnumber != null
                ? String(customers[0].accountnumber)
                : "",
            emidue:
              customers[0]?.emidue != null
                ? String(customers[0].emidue)
                : "",
          },
        }}
      >
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton}>
            <CreditCard color="white" size={20} style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Make Payment</Text>
          </TouchableOpacity>
        </View>
      </Link>
    </SafeAreaView>
  );
};

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <View style={styles.infoCard}>
    <View style={styles.iconBox}>{icon}</View>
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: '#136dec',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#136dec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 6,
  },
  bgIconContainer: {
    position: 'absolute',
    right: -20,
    top: -10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconBox: {
    backgroundColor: 'rgba(19, 109, 236, 0.1)',
    padding: 12,
    borderRadius: 10,
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  emiCard: {
    backgroundColor: 'rgba(19, 109, 236, 0.05)',
    borderColor: 'rgba(19, 109, 236, 0.2)',
    marginTop: 8,
  },
  emiIconBox: {
    backgroundColor: '#136dec',
    padding: 12,
    borderRadius: 10,
    marginRight: 16,
  },
  emiLabel: {
    fontSize: 11,
    color: '#136dec',
    fontWeight: 'bold',
  },
  emiAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  primaryButton: {
    backgroundColor: '#136dec',
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  summaryContent: {
    padding: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  customerCard: {
    marginBottom: 32,
  },
});

export default LoanDetailsScreen;