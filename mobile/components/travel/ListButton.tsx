import React from 'react';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ListButtonProps = {
  title: string;
  description?: string;
  href?: React.ComponentProps<typeof Link>['href'];
  onPress?: () => void;
};

function ListButtonContent({ title, description }: Pick<ListButtonProps, 'title' | 'description'>) {
  return (
    <>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <MaterialIcons name="chevron-right" size={20} color="#CBD5E1" />
    </>
  );
}

export function ListButton({ title, description, href, onPress }: ListButtonProps) {
  const button = (
    <Pressable style={styles.button} onPress={onPress}>
      <ListButtonContent title={title} description={description} />
    </Pressable>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        {button}
      </Link>
    );
  }

  return button;
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    color: '#64748B',
  },
});
