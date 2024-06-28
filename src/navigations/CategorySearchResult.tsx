import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import MovieItem from '../components/movies/MovieItem';
import { Movie } from '../types/app';

interface Genre {
  id: number;
  name: string;
}

const CategorySearchResult = ({ route }: { route: any }): JSX.Element => {
  const { selectedGenres, genres } = route.params;
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchMovies();
  }, [selectedGenres]);

  const fetchMovies = async () => {
    setLoading(true);
    const genreIdsString = selectedGenres.join(',');
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIdsString}`;

    try {
      const response = await fetch(url, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      setSearchResults(data.results);
      setError('');
    } catch (error) {
      if (error instanceof Error) {
        setError('Error fetching search results: ' + error.message);
        console.error('Error fetching search results:', error.message);
      } else {
        setError('An unknown error occurred');
        console.error('An unknown error occurred:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderMovieItem = ({ item }: { item: Movie }): JSX.Element => (
    <View style={styles.movieItemContainer}>
      <MovieItem 
        movie={item}
        size={{
          width: (Dimensions.get('window').width - 64) / 3, // Adjust the width of each item
          height: (Dimensions.get('window').width - 64) / 3 * 1.5, // Maintain the aspect ratio
        }}
        coverType="poster" 
      />
    </View>
  );

  const renderSeparator = (): JSX.Element => <View style={styles.separator} />;

  const renderFooter = (): JSX.Element | null => {
    if (!loading) return null;
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  const renderEmptyState = (): JSX.Element | null => {
    if (!loading && searchResults.length === 0 && error) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Result of {selectedGenres.map((genreId: number) => {
        const selectedGenre = genres.find((genre: Genre) => genre.id === genreId);
        return selectedGenre ? selectedGenre.name : 'Unknown Genre';
      }).join(', ')} Genre</Text>
      <FlatList
        data={searchResults}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.movieList}
        ItemSeparatorComponent={renderSeparator}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        numColumns={3} // Set to 3 columns
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 24,
    marginVertical: 16,
    textAlign: 'center',
  },
  movieList: {
    justifyContent: 'center', // Center items horizontally
  },
  movieItemContainer: {
    paddingLeft: 7, // Add padding between items
    paddingBottom: 7, // Add padding between items
    paddingTop: 7, // Add padding between items
    alignItems: 'center', // Center items horizontally
 },
 separator: {
    height: 8,
 },
 loading: {
    marginVertical: 20,
    alignItems: 'center',
  },
  emptyState: {
   justifyContent: 'center',
   alignItems: 'center',
    padding: 20,
  },
 emptyText: {
   color: '#ff0000',
    fontSize: 16,
  },
});

export default CategorySearchResult;
