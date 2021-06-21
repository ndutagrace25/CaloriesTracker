import NetInfo from "@react-native-community/netinfo";

const isOnline = (result) => {
    const notConnected = {
        error: "Not connected"
    };
    NetInfo
        .fetch()
        .then(state => {
            // console.log(state);
            if (state.isConnected && state.isInternetReachable) {
                return result(null, state);
            } else {
                return result(notConnected, null);
            }
        })
        .catch(err => {
            return result(notConnected, null);
        });
}

export default isOnline;