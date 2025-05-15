import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Doc } from "../../../convex/_generated/dataModel";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1px solid black',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
  },
  value: {
    width: '70%',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  col1: { width: '30%' },
  col2: { width: '30%' },
  col3: { width: '10%' },
  col4: { width: '15%' },
  col5: { width: '15%' },
  disclaimer: {
    fontSize: 7,
    marginTop: 20,
    color: 'gray',
  },
});

interface BOLPDFProps {
  bol: Doc<"bols">;
}

export function BOLPDF({ bol }: BOLPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            src="https://effervescent-camel-645.convex.cloud/api/storage/05b48caa-f6b9-4de0-b356-b91e1164defe"
            style={styles.logo}
          />
          <View>
            <Text style={styles.title}>BILL OF LADING</Text>
            <Text>BOL #{bol._id}</Text>
            <Text>Date: {bol.date}</Text>
          </View>
        </View>

        {/* Load Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Load Details</Text>
          {/* Add load detail fields */}
        </View>

        {/* Carrier Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carrier Information</Text>
          {/* Add carrier information fields */}
        </View>

        {/* Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locations</Text>
          {/* Add location fields */}
        </View>

        {/* Pay Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Description</Text>
              <Text style={styles.col2}>Notes</Text>
              <Text style={styles.col3}>QTY</Text>
              <Text style={styles.col4}>Rate</Text>
              <Text style={styles.col5}>Amount</Text>
            </View>
            {bol.payItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>{item.description}</Text>
                <Text style={styles.col2}>{item.notes}</Text>
                <Text style={styles.col3}>{item.quantity}</Text>
                <Text style={styles.col4}>${item.rate}</Text>
                <Text style={styles.col5}>${item.amount}</Text>
              </View>
            ))}
            <View style={[styles.tableRow, { borderTopWidth: 1, borderTopColor: 'black' }]}>
              <Text style={[styles.col1, { fontWeight: 'bold' }]}>Grand Total</Text>
              <Text style={[styles.col5, { fontWeight: 'bold' }]}>${bol.grandTotal}</Text>
            </View>
          </View>
        </View>

        {/* Signature */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{bol.signerName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Signature:</Text>
            <Text style={styles.value}>{bol.signature}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{bol.signDate}</Text>
          </View>
        </View>

        {/* Disclaimers */}
        <View>
          <Text style={styles.disclaimer}>
            Net30 Payout $0 Processing fee I Quick pay 5% Processing fee 72 hour payout
          </Text>
          {/* Add other disclaimers */}
        </View>
      </Page>
    </Document>
  );
}
