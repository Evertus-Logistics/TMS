import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Doc } from "../../convex/_generated/dataModel";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '2px solid #FFD700',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  logo: {
    width: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  businessInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  companyDetails: {
    padding: 10,
    borderRadius: 4,
    border: '1px solid #ccc',
    backgroundColor: '#f8f8f8',
    width: '48%',
  },
  clientDetails: {
    padding: 10,
    borderRadius: 4,
    border: '1px solid #ccc',
    backgroundColor: '#f8f8f8',
    width: '48%',
  },
  companyText: {
    marginBottom: 5,
    color: '#333',
  },
  detailsHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
    borderBottom: '1px solid #ccc',
    paddingBottom: 4,
  },
  section: {
    marginBottom: 15,
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
    borderBottom: '1px solid #ccc',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
    color: '#777',
  },
  value: {
    width: '70%',
    color: '#333',
  },
  total: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1a1a1a',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#777',
    fontSize: 10,
    borderTop: '1px solid #ccc',
    paddingTop: 10,
  },
  contactInfo: {
    marginTop: 5,
    color: '#777',
  },
  invoiceInfo: {
    marginBottom: 10,
    color: '#333',
  },
});

interface InvoicePDFProps {
  load: Doc<"loads">;
}

export function InvoicePDF({ load }: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Image 
              src="https://effervescent-camel-645.convex.cloud/api/storage/05b48caa-f6b9-4de0-b356-b91e1164defe"
              style={styles.logo}
            />
            <View>
              <Text style={styles.title}>INVOICE</Text>
              <Text style={styles.invoiceInfo}>Invoice #{load._id}</Text>
              <Text style={styles.invoiceInfo}>Date: {load.dateInvoicedClient}</Text>
            </View>
          </View>

          <View style={styles.businessInfoContainer}>
            {/* Evertus Details */}
            <View style={styles.companyDetails}>
              <Text style={styles.detailsHeader}>FROM</Text>
              <Text style={styles.companyText}>Evertus Logistics</Text>
              <Text style={styles.companyText}>DOT # 4026580  |  MC Authority # MC1520134</Text>
              <Text style={styles.companyText}>Office: (877) 874-3958  |  Acc#:(307) 459-8820</Text>
              <Text style={styles.companyText}>34 N Franklin Ave Ste 687 #5010</Text>
              <Text style={styles.companyText}>Pinedale, WY 82941. USA</Text>
              <Text style={styles.companyText}>www.Evertus-Logistics.com</Text>
            </View>

            {/* Client Details */}
            <View style={styles.clientDetails}>
              <Text style={styles.detailsHeader}>BILL TO</Text>
              <Text style={styles.companyText}>{load.customerBusinessName}</Text>
              <Text style={styles.companyText}>{load.carrierStreetAddress}</Text>
              <Text style={styles.companyText}>{`${load.carrierCity}, ${load.carrierState} ${load.carrierZip}`}</Text>
              <Text style={styles.companyText}>{`POC: ${load.carrierPOC}`}</Text>
              <Text style={styles.companyText}>{`Phone: ${load.carrierPOCPhone}`}</Text>
              <Text style={styles.companyText}>{`Email: ${load.carrierPOCEmail}`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Load Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Load ID:</Text>
            <Text style={styles.value}>{load._id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Commodity:</Text>
            <Text style={styles.value}>{load.loadCommodity}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pickup:</Text>
            <Text style={styles.value}>
              {`${load.pickupBuildingName}, ${load.pickupCity}, ${load.pickupState} ${load.pickupZip}`}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery:</Text>
            <Text style={styles.value}>
              {`${load.dropoffBuildingName}, ${load.dropoffCity}, ${load.dropoffState} ${load.dropoffZip}`}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pickup Date:</Text>
            <Text style={styles.value}>{load.pickupDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Date:</Text>
            <Text style={styles.value}>{load.dropoffDate}</Text>
          </View>
        </View>

        <View style={styles.total}>
          <View style={styles.totalRow}>
            <Text>Total Amount:</Text>
            <Text>${load.totalFinalInvoice?.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text style={styles.contactInfo}>For any questions, please contact: Accounting@Evertu-logistics.com</Text>
          <Text style={styles.contactInfo}>Need help Building Company Credit? Message Evertus Small Business Solution (802)432-8677</Text>
        </View>
      </Page>
    </Document>
  );
}
