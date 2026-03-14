import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AppHeader } from '@/components/travel/AppHeader';
import { travelStyles } from '@/components/travel/styles';
import { friendsMock, profileMock, weatherMock } from '@/data/travel';

export default function MyPageScreen() {
  const handleAddFriend = (method: string) => {
    Alert.alert('準備中', `${method} は未実装です`);
  };

  return (
    <View style={travelStyles.screen}>
      <AppHeader title="マイページ" weatherLabel={`${weatherMock.temp} ${weatherMock.condition}`} />

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/200?img=12' }}
              style={styles.avatar}
            />
            <Pressable style={styles.editIcon} onPress={() => handleAddFriend('プロフィール編集')}>
              <MaterialIcons name="edit" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
          <Text style={styles.profileName}>{profileMock.name}</Text>
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={16} color="#64748B" />
            <Text style={styles.locationText}>最寄り駅: {profileMock.nearestStation}</Text>
          </View>
        </View>

        <View style={travelStyles.detailSection}>
          <Text style={styles.sectionHeader}>友達追加</Text>
          <View style={styles.friendActions}>
            <Pressable style={styles.actionCard} onPress={() => handleAddFriend('ID検索')}>
              <MaterialIcons name="person-search" size={20} color="#F97316" />
              <Text style={styles.actionText}>ID検索</Text>
            </Pressable>
            <Pressable style={styles.actionCard} onPress={() => handleAddFriend('QRコード')}>
              <MaterialIcons name="qr-code-2" size={20} color="#F97316" />
              <Text style={styles.actionText}>QRコード</Text>
            </Pressable>
          </View>
        </View>

        <View style={travelStyles.detailSection}>
          <Text style={styles.sectionHeader}>フレンド一覧（{friendsMock.length}人）</Text>
          <FlatList
            data={friendsMock}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={[travelStyles.card, { marginTop: 8 }]}>
                <Text style={travelStyles.buttonTitle}>{item.name}</Text>
                <Text style={travelStyles.sectionBody}>{item.role}</Text>
                <Text style={travelStyles.subheading}>登録: {item.addedAt}</Text>
              </View>
            )}
          />
        </View>

        <View style={travelStyles.detailSection}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <MaterialIcons name="history" size={20} color="#64748B" />
              <Text style={travelStyles.buttonTitle}>旅行履歴</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#CBD5E1" />
          </View>
          <View style={[styles.menuItem, { borderTopWidth: 1, borderTopColor: '#E5E7EB' }]}>
            <View style={styles.menuLeft}>
              <MaterialIcons name="bookmark-border" size={20} color="#64748B" />
              <Text style={travelStyles.buttonTitle}>保存した旅程</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#CBD5E1" />
          </View>
          <View style={[styles.menuItem, { borderTopWidth: 1, borderTopColor: '#E5E7EB' }]}>
            <View style={styles.menuLeft}>
              <MaterialIcons name="settings" size={20} color="#64748B" />
              <Text style={travelStyles.buttonTitle}>設定</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#CBD5E1" />
          </View>
        </View>

        <View style={styles.premiumCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>プレミアムプラン</Text>
            <Text style={styles.premiumText}>もっと旅を快適に。保存上限や提案精度を拡張。</Text>
          </View>
          <MaterialIcons name="workspace-premium" size={28} color="#F97316" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    ...travelStyles.container,
    paddingBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 22,
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  avatarWrap: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 4,
    borderColor: 'rgba(249,115,22,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FFF7ED',
    marginBottom: 8,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  friendActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    minHeight: 76,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
  },
  actionText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
    paddingVertical: 10,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  premiumCard: {
    borderWidth: 1,
    borderColor: '#FDE68A',
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  premiumTitle: {
    color: '#F97316',
    fontWeight: '700',
    marginBottom: 4,
  },
  premiumText: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
  },
});
