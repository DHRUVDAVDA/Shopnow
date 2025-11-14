import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated as RNAnimated,
  SectionList,
  Alert,
} from 'react-native';
import { fetchProducts } from '../../utils/apiCalls';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutDown,
} from 'react-native-reanimated';
import { Loader } from '../../components/loader';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput } from 'react-native-paper';
import ProductCard from '../../components/ProductCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import useNetworkStatus from '../../components/networkStatus';
import { setProducts } from '../../store/productsSlice';

const HomeScreen = () => {
  const { username } = useSelector((state: any) => state.user);
  const navigation = useNavigation<any>();

  const isConnected = useNetworkStatus();

  const [products, setProduct] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchedTxt, setSearchedTxt] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const dispatch = useDispatch();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      dispatch(setProducts(data));
      setProduct(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsFetched(true);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    setIsScrolled(currentOffset > 20);
  };

  const filtered = products.filter(
    item =>
      item.title.toLowerCase().includes(searchedTxt.toLowerCase()) ||
      item.category.toLowerCase().includes(searchedTxt.toLowerCase()),
  );

  const groupedProducts = filtered.reduce((acc: any[], item) => {
    const category = item.category || 'Other';
    const existing = acc.find(sec => sec.title === category);
    if (existing) existing.data.push(item);
    else acc.push({ title: category, data: [item] });
    return acc;
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Loader visible={loading} />

        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation?.getParent()?.openDrawer()}
          >
            <Icon name="menu" color={'black'} size={30} />
          </TouchableOpacity>

          <Animated.View
            style={{
              flex: 1,
              marginLeft: 10,
              justifyContent: 'center',
            }}
          >
            {searchedTxt.length === 0 && !isScrolled ? (
              <Animated.Text
                entering={FadeIn.duration(400)}
                exiting={FadeOut.duration(400)}
                style={styles.usernametxt}
              >
                Hi, {username || 'Guest'}!
              </Animated.Text>
            ) : (
              <Animated.View
                entering={FadeIn.duration(400)}
                exiting={FadeOut.duration(400)}
                style={styles.searchContainer}
              >
                <View style={styles.searchWrapper}>
                  <TextInput
                    mode="outlined"
                    label="Search products..."
                    value={searchedTxt}
                    onChangeText={setSearchedTxt}
                    style={styles.input}
                    theme={{ roundness: 10 }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setSearchedTxt('');
                      setIsScrolled(false);
                    }}
                    style={styles.clearButton}
                  >
                    <Icon name="close" size={22} color="gray" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        </View>

        <SectionList
          sections={groupedProducts}
          keyExtractor={item => item.id.toString()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 200 }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) =>
            section.data.length > 0 ? (
              <Text style={styles.categoryHeader}>
                {section.title.toUpperCase()}
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() =>
                navigation.navigate('productdetail', { product: item })
              }
            />
          )}
          ListEmptyComponent={() => (
            <>
              {isFetched && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No products found!</Text>
                </View>
              )}
            </>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
    height: 70,
  },
  usernametxt: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginTop: 10,
    marginBottom: 6,
  },
  searchContainer: {
    width: '100%',
    // paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: '#fff',
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    padding: 4,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
  },
  details: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '600', color: '#333' },
  price: { marginTop: 5, fontSize: 14, fontWeight: 'bold', color: '#4facfe' },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default HomeScreen;
