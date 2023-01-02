import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    color: '#4c4c4c'
  },
  centeredContainer: {
    padding: 30,
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4c4c4c'
  },
  title: {
    fontSize: 24,
    marginVertical: 0,
    textAlign: 'center'
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center'
  },
  palavra: {
    fontSize: 20,
    marginVertical: 10,
    textAlign: 'center',
    color: '#35951D',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 5
  },
  button: {
    borderColor: '#4c4c4c',
    backgroundColor: '#e9e9e9',
    // width: '100%',
    marginVertical: 5,
    padding: 15
  },
  buttonTitle: {
    color: '#4c4c4c',
    marginLeft: 5,
    fontSize: 18
  },
  buttonIcon: {
    color: '#4c4c4c'
  },
  borderBox: {
    borderWidth: 1,
    borderColor: '#4c4c4c',
    borderRadius: 10,
    padding: 20,
    marginBottom: 40,
    backgroundColor: '#e5e5e5'
  }
});

export const getTeamColor = (team: 1 | 2 | undefined) => {
  if (team === 1)
    return 'coral'
  if (team === 2)
    return '#177e89'
  if (team === undefined)
    return undefined
}