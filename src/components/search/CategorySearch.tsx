import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { API_ACCESS_TOKEN } from '@env';

type Genre = {
  id: number;
  name: string;
};

const CategorySearch = (): JSX.Element => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/genre/movie/list`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (genreId: number) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  };

  const navigation = useNavigation();

  const handleSearch = () => {
    navigation.dispatch(StackActions.push('CategorySearchResult', { selectedGenres, genres }));
    console.log('Searching for movies with genres:', selectedGenres);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              activeOpacity={0.9}
              style={[
                styles.genreButton,
                {
                  backgroundColor: selectedGenres.includes(genre.id) ? '#8978A4' : '#dfd7ec',
                },
              ]}
              onPress={() => handlePress(genre.id)}
            >
              <Text style={styles.genreLabel}>{genre.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
  },
  genreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 45,
    marginBottom: 8,
    borderRadius: 10,
  },
  genreLabel: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  searchButton: {
    backgroundColor: '#8c77a7',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: '100%',
    marginTop: 16,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default CategorySearch;
