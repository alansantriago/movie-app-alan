import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, Dimensions, Text, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { API_ACCESS_TOKEN } from '@env';
import MovieItem from '../movies/MovieItem';
import type { Movie } from '../../types/app';

const coverImageSize = {
  width: Dimensions.get('window').width / 3 - 32,
  height: (Dimensions.get('window').width / 3 - 32) * 1.5,
};

const KeywordSearch = (): JSX.Element => {
  const [keyword, setKeyword] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [keyword]);

  const fetchMovies = useCallback(async (): Promise<void> => {
    if (!keyword) return;

    setLoading(true);
    setError(null);

    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&page=${page}`;
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
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      }
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      setError('Error fetching movies.');
    } finally {
      setLoading(false);
    }
  }, [keyword, page]);

  const handleSubmit = (): void => {
    if (keyword) {
      setPage(1);
      fetchMovies();
    }
  };

  const renderMovieItem = ({ item }: { item: Movie }): JSX.Element => (
    <TouchableOpacity style={styles.movieItemContainer}>
      <MovieItem 
        movie={item}
        size={coverImageSize}
        coverType="poster" 
      />
    </TouchableOpacity>
  );

  const renderSeparator = (): JSX.Element => <View style={styles.separator} />;

  const renderFooter = (): JSX.Element | null => {
    if (!loading) return null;
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Input movie title here"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSubmit}
        />
        <FontAwesome name="search" size={20} color="black" style={styles.icon} onPress={handleSubmit} />
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.movieList}
          numColumns={3}
          ItemSeparatorComponent={renderSeparator}
          ListFooterComponent={renderFooter}
          onEndReached={fetchMovies}
          onEndReachedThreshold={0.1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 5,
  },
  icon: {
    marginLeft: 10,
    marginRight: 5,
  },
  movieList: {
    marginTop: 10,
  },
  separator: {
    width: '100%',
    height: 4,
  },
  movieItemContainer: {
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loading: {
    marginTop: 10,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default KeywordSearch;
