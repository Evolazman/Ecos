import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';
import { useState } from 'react';

interface FaceRecognitionPolicyModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function FaceRecognitionPolicyModal({
  visible,
  onAccept,
  onDecline,
}: FaceRecognitionPolicyModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onDecline}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>นโยบายความเป็นส่วนตัวเกี่ยวกับการจัดเก็บข้อมูลใบหน้า</Text>
          
          <ScrollView style={styles.scrollView}>
            <Text style={styles.sectionTitle}>วัตถุประสงค์ในการเก็บข้อมูล</Text>
            <Text style={styles.policyText}>
            เรามีการจัดเก็บข้อมูลใบหน้าของท่านเพื่อใช้ในการยืนยันตัวตน การลงทะเบียนเข้าใช้งานระบบ และเพิ่มความปลอดภัยในการใช้งาน โดยข้อมูลใบหน้าของท่านจะถูกใช้เฉพาะตามวัตถุประสงค์ที่แจ้งไว้เท่านั้น ไม่มีการใช้เพื่อวัตถุประสงค์อื่นใดโดยไม่ได้รับอนุญาตจากท่าน
            </Text>

            <Text style={styles.sectionTitle}>ข้อมูลที่เราเก็บรวบรวม</Text>
            <Text style={styles.policyText}>
              - รูปภาพหรือวิดีโอของใบหน้าเพื่อใช้ในการระบุหรือยืนยันตัวตน
              {'\n'}- ข้อมูลโครงสร้างใบหน้า (facial landmarks) ซึ่งระบบจะใช้ในการจดจำใบหน้า
            </Text>

            <Text style={styles.sectionTitle}>วิธีการเก็บข้อมูล</Text>
            <Text style={styles.policyText}>
            ข้อมูลใบหน้าของท่านจะถูกเก็บผ่านระบบสแกนใบหน้า หรือการอัปโหลดภาพจากอุปกรณ์ของท่านเอง โดยเราจะดำเนินการเข้ารหัสข้อมูล (encryption) เพื่อความปลอดภัยและป้องกันการเข้าถึงจากบุคคลที่ไม่ได้รับอนุญาต
            </Text>

            <Text style={styles.sectionTitle}>การจัดเก็บและระยะเวลา</Text>
            <Text style={styles.policyText}>
            ข้อมูลใบหน้าของท่านจะถูกจัดเก็บอย่างปลอดภัยในฐานข้อมูลที่มีการควบคุมการเข้าถึงอย่างเคร่งครัด โดยจะถูกเก็บไว้เฉพาะในช่วงระยะเวลาที่ท่านยังคงใช้งานบริการหรือจนกว่าท่านจะแจ้งยกเลิกหรือถอนความยินยอม และเราจะดำเนินการลบข้อมูลใบหน้าของท่านทันทีเมื่อหมดวัตถุประสงค์ในการใช้งาน
            </Text>

            <Text style={styles.sectionTitle}>การเปิดเผยข้อมูลต่อบุคคลที่สาม</Text>
            <Text style={styles.policyText}>
            เราจะไม่เปิดเผยข้อมูลใบหน้าของท่านให้แก่บุคคลภายนอกหรือองค์กรอื่น เว้นแต่จะได้รับความยินยอมจากท่านเป็นลายลักษณ์อักษร หรือเป็นกรณีที่จำเป็นตามข้อกฎหมายเท่านั้น
            </Text>

            <Text style={styles.sectionTitle}>สิทธิของเจ้าของข้อมูล</Text>
            <Text style={styles.policyText}>
              - ท่านมีสิทธิที่จะขอเข้าถึงข้อมูลของท่านเองได้ทุกเมื่อ
              {'\n'}- ท่านสามารถขอให้มีการแก้ไข อัปเดต หรือเปลี่ยนแปลงข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์ได้
              {'\n'}- ท่านมีสิทธิขอถอนความยินยอมในการจัดเก็บข้อมูลใบหน้าของท่านได้ทุกเมื่อ
            </Text>

            <Text style={styles.sectionTitle}>ช่องทางติดต่อสอบถาม</Text>
            <Text style={styles.policyText}>
            หากท่านมีข้อสงสัยเกี่ยวกับการจัดเก็บข้อมูลใบหน้าของท่าน หรือต้องการใช้สิทธิของเจ้าของข้อมูล สามารถติดต่อได้ที่ :
            {'\n'}
              {'\n'}อีเมล: Ecos@EcoCycle.com 
              {'\n'}เบอร์โทรศัพท์: 02-888-2999
            </Text>

            <Text style={styles.policyText}>
            ทางเราขอขอบคุณที่ท่านไว้วางใจและให้ความร่วมมือในการดูแลข้อมูลส่วนบุคคลของท่าน
            </Text>

            <TouchableOpacity 
              style={styles.consentSection}
              onPress={() => setIsChecked(!isChecked)}
              activeOpacity={0.7}
            >
              <View style={styles.checkbox}>
                {isChecked && <Check color="#007AFF" size={16} />}
              </View>
              <Text style={styles.consentText}>
                ข้าพเจ้าได้อ่าน ทำความเข้าใจ และยินยอมให้มีการจัดเก็บและใช้ข้อมูลใบหน้าตามรายละเอียดในนโยบายฉบับนี้ โดยสมัครใจ ไม่มีการบังคับ หรือถูกชักจูงแต่อย่างใด
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={onDecline}
            >
              <Text style={[styles.buttonText, styles.declineButtonText]}>
                Decline
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.acceptButton,
                !isChecked && styles.acceptButtonDisabled
              ]}
              onPress={handleAccept}
              disabled={!isChecked}
            >
              <Text style={[
                styles.buttonText, 
                styles.acceptButtonText,
                !isChecked && styles.acceptButtonTextDisabled
              ]}>
                Accept & Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  scrollView: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 15,
    marginBottom: 10,
  },
  policyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a4a4a',
    marginBottom: 15,
  },
  consentSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 6,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  consentText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#2c3e50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#007AFF',
  },
  acceptButtonDisabled: {
    backgroundColor: '#ccc',
  },
  declineButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  acceptButtonText: {
    color: 'white',
  },
  acceptButtonTextDisabled: {
    color: '#999',
  },
  declineButtonText: {
    color: '#666',
  },
});