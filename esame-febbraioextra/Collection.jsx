//codice incompleto, non testato e probabilemente non funzionante
//manca implementazione lista
/*
data la richiesta originaria e l'architettura del codice
risulta conveniente implementare la lista prima di eseguire un log (tempo permettendo)
nella fase di implementazione della lista, si potrà inserire il log per verificare 
il corretto funzionamento
*/
import React, { useState, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import * as NewAlert from '../Common/Alert.jsx';

// Context
import { LocationContext } from '../../models/LocationContext';
import { UserContext } from '../../models/UserContext';

// Components
import { NearList } from "../sezioni/NearList";

// Services
import * as NearListRepo from "../RepoAssist/NearListRepo.jsx";
import CommunicationController from '../CommunicationController.jsx';

export default function Collection() {

    const { navigation } = useNavigation();
    const { location } = useContext(LocationContext);
    const { user } = useContext(UserContext);
    const [nearlist, setNL] = useState();
    const [isLoading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            if (location != null) {
                (async () => {
                    setLoading(true);
                    let row = await CommunicationController.getCollection(user.sid).catch((error) => {
                        console.log("Collection - Error: " + error);
                        NewAlert.createAlert("Errore", "Impossibile caricare il gli oggetti vicini. Verifica la connessione o riprova più tardi.", [{ text: "OK", onPress: () => { navigation.navigate('Map') } }]);
                    });
                    
                    row.forEach(async element => {
                        let obj = await NearListRepo.loadVObjDetails(user.sid, element.id).catch((error) => {
                            console.log("Collection - Error: " + error);
                            NewAlert.createAlert("Errore", "Impossibile caricare il gli oggetti vicini. Verifica la connessione o riprova più tardi.", [{ text: "OK", onPress: () => { navigation.navigate('Map') } }]);
                        });
                        console.log("esamefebbraio - " + obj.name + " id " + obj.id );
                    });


                    setNL(row);
                    setLoading(false);
                })();
            }
        }, [user])
    );

    /*return (
        <View style={{ flex: 1, flexDirection: 'columns' }}>
            {isLoading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
                :
                <NearList nearlist={nearlist}></NearList>}
        </View>
    );*/
    return (
        <View style={{ flex: 1, flexDirection: 'columns' }}>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>

        </View>
    );
}