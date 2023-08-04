import React, {useState, useEffect, useCallback} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import colors from '../../theme/defaultColor';
import {Bubble, GiftedChat, IMessage, User} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';

interface CustomMessage extends IMessage {
  sendBy: string;
  sendTo: string;
}

type ChattingRouteParams = {
  params: {id: any; data: any};
  id: string;
  data: {
    xuserId: string;
  };
};

export default function Chatting() {
  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const route = useRoute<ChattingRouteParams>();
  const {id, data} = route.params;

  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(id + data.xuserId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const allMsgs: CustomMessage[] = [];
        querySnapshot.forEach(documentSnapshot => {
          const msg: CustomMessage = documentSnapshot.data();
          allMsgs.push({
            ...msg,
            createdAt: msg.createdAt.toDate(), // Convert to Date object
          });
        });
        // Reverse the order of messages to display the latest messages at the bottom
        setMessages(allMsgs.reverse());
      });

    return () => subscriber();
  }, [id, data?.xuserId]);

  const onSendMessage = useCallback(
    async (newMessages: CustomMessage[] = []) => {
      const msg = newMessages[0];
      const myMsg: CustomMessage = {
        ...msg,
        sendBy: id,
        sendTo: data?.xuserId,
        createdAt: msg.createdAt.getTime(),
      };
      setMessages(prevMessages => GiftedChat.append(prevMessages, myMsg));

      await firestore()
        .collection('chats')
        .doc(id + data?.xuserId)
        .collection('messages')
        .add(myMsg);

      await firestore()
        .collection('chats')
        .doc(data?.xuserId + id)
        .collection('messages')
        .add(myMsg);
    },
    [id, data?.xuserId],
  );

  return (
    <View style={styles.content}>
      <GiftedChat
        messages={messages}
        onSend={onSendMessage}
        user={{_id: route.params.id}}
        infiniteScroll
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: colors.primary,
              },
              right: {
                backgroundColor: colors.secondary,
              },
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  content: {backgroundColor: '#ffffff', flex: 1},
});
