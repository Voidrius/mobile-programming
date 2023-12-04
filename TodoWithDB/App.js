import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Pressable,
} from 'react-native';
import {Realm} from 'realm';
import {
  AppProvider,
  UserProvider,
  RealmProvider,
  useAuth,
  useQuery,
  useRealm,
} from '@realm/react';

// Define a Realm Object Type for Todo
export class Todo extends Realm.Object {
  static schema = {
    name: 'Todo',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new BSON.ObjectId()},
      text: 'string',
      isComplete: 'bool',
    },
  };
}

// AppWrapper component with Atlas Device SDK integration
export const AppWrapper = () => {
  return (
    <AppProvider id="<YOUR_APP_ID>">
      <UserProvider fallback={LoginComponent}>
        <RealmProvider schema={[Todo]}>
          <TodoApp />
        </RealmProvider>
      </UserProvider>
    </AppProvider>
  );
};

// TodoApp component using Realm functionality
const TodoApp = () => {
  const todos = useQuery(Todo);
  const realm = useRealm();
  const {logInWithAnonymous, result} = useAuth();

  const addTodo = text => {
    realm.write(() => {
      realm.create(Todo, {text, completed: false});
    });
  };

  const removeTodo = id => {
    const todo = realm.objectForPrimaryKey(Todo, id);
    realm.write(() => {
      realm.delete(todo);
    });
  };

  const toggleTodo = id => {
    const todo = realm.objectForPrimaryKey(Todo, id);
    realm.write(() => {
      todo.completed = !todo.completed;
    });
  };

  return (
    <View>
      <Pressable onPress={logInWithAnonymous}>
        <Text>Log In</Text>
      </Pressable>
      {result.error && <Text>{result.error.message}</Text>}

      <View>
        <TextInput
          style={styles.addToDoTextInput}
          value={itemText}
          onChangeText={text => setItemText(text)}
          placeholder="Write a new todo here"
        />
        <Button
          title="Add"
          style={styles.addTodoButton}
          onPress={() => addTodo(itemText)}
        />
      </View>

      <ScrollView style={styles.list}>
        {todos.map(todo => (
          <View key={todo._id} style={styles.listItem}>
            <Text
              style={[
                styles.listItemText,
                {textDecorationLine: todo.completed ? 'line-through' : 'none'},
              ]}
              onPress={() => toggleTodo(todo._id)}>
              * {todo.text}
            </Text>
            <Text
              style={styles.listItemDelete}
              onPress={() => removeTodo(todo._id)}>
              X
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    margin: 5,
  },
  banner: {
    backgroundColor: 'cadetblue',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bannerText: {
    color: 'white',
    textAlign: 'center',
  },
  addToDo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addToDoTextInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    padding: 5,
    margin: 2,
    flex: 1,
  },
  list: {
    color: 'black',
    margin: 2,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
  },
  listItemText: {},
  listItemDelete: {
    marginStart: 10,
    color: 'red',
    fontWeight: 'bold',
  },
});
