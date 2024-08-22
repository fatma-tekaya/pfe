import { StyleSheet } from "react-native";
import { colors } from './colors';
export const globalStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    texttitle: {
        fontFamily: 'Outfit-Medium',
        fontSize: 28,
        fontWeight: '600',
        color: colors.blue_fonce,
        marginBottom: 20,
    },
    image: {
        marginTop: 10,
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 75,
        paddingHorizontal: 10,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
    },
    buttonText: {
        marginLeft: 10,
        color: 'gray',
        fontSize: 16,
        fontFamily: 'Outfit-Medium',

    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -15,
        marginBottom: 30,
        fontFamily: 'Outfit-Medium',

    },
    /*robot*/
    emptyText: {
        fontFamily: 'Outfit-Light',
        fontSize: 20,
        color: colors.bleu,
        textAlign: 'center',
        marginTop: -100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70,
    },
    emptyGif: {
        width: 200,
        height: 200,
        marginBottom: 150,
    },
})