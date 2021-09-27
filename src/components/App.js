import React, {Component} from 'react';
import Web3 from 'web3';
import './Main.css';
import Songstore from '../abis/Songstore.json'
import NavigationBar from './NavigationBar'
import View from './View'


class App extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        //load account
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})

        const networkId = await web3.eth.net.getId()
        const networkData = Songstore.networks[networkId]
        if (networkData) {
            const songstore = web3.eth.Contract(Songstore.abi, networkData.address)
            this.setState({songstore})
            const allSongsCounter = await songstore.methods.allSongsCounter().call()
            this.setState({allSongsCounter: allSongsCounter})
            // Load songs
            for (let i = 1; i <= allSongsCounter; i++) {
                const song = await songstore.methods.songs(i).call()
                this.setState({
                    songs: [...this.state.songs, {...song, selectedValue: "priceDownloadLicense"}]
                })
            }
            this.setState({loading: false})
        } else {
            window.alert('Songstore contract not deployed to detected network')
        }

    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            allSongsCounter: 0,
            songs: [],
            loading: true
        }

        this.createSong = this.createSong.bind(this)
    }

    createSong(title, artist, genre, priceDownloadLicense, priceCoverLicense, priceRegularLicense, priceExtendedLicense) {
        this.setState({loading: true})
        this.state.songstore.methods.createSong(title, artist, genre, priceDownloadLicense, priceCoverLicense,
            priceRegularLicense, priceExtendedLicense).send({from: this.state.account})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            })
    }

    purchaseSong = (id) => {
        this.setState({loading: true})
        const row = this.state.songs.find((x) => x.id === id);
        console.log(typeof row[row.selectedValue]);
        const mySelectedValue = row[row.selectedValue];
        console.log(typeof mySelectedValue)
        this.state.songstore.methods.purchaseSong(id).send({from: this.state.account, value: mySelectedValue})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            })
    }

    onSelectChange = (selectedValue, song) => {
        this.setState({
            songs: this.state.songs.map((x) => x.id === song.id ? {...x, selectedValue} : x
            )
        });
    }


    render() {
        return (
            <div>
                <NavigationBar account={this.state.account}/>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex">
                            {this.state.loading
                                ?
                                <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                                : <View
                                    songs={this.state.songs}
                                    account={this.state.account}
                                    createSong={this.createSong}
                                    purchaseSong={this.purchaseSong}
                                    onSelectChange={this.onSelectChange}
                                />
                            }
                        </main>
                    </div>
                </div>
            </div>
        );

    }
}

export default App;
