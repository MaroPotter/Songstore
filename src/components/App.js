import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo2.png';
import './App.css';
import Songstore from '../abis/Songstore.json'
import Navbar from './Navbar'
import Main from './Main'


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }  
  async loadWeb3() {
     if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //load account
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = Songstore.networks[networkId]
    if(networkData) {
      const songstore = web3.eth.Contract(Songstore.abi, networkData.address)
      this.setState({songstore})
      const productCount = await songstore.methods.productCount().call()
      this.setState({ productCount })
      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await songstore.methods.products(i).call()
        this.setState({
          products: [...this.state.products, {...product, selectedValue: "priceDigitalDownload"}]
        })
      }
      this.setState({loading:false})
    } else {
        window.alert('Songstore contract not deployed to detected network')
    }

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this)
  }

   createProduct(name, priceDigitalDownload, priceCoverVersion, priceRegularLicense, priceExtendedLicense) {
    this.setState({ loading: true })
    this.state.songstore.methods.createProduct(name, priceDigitalDownload, priceCoverVersion, priceRegularLicense, priceExtendedLicense).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  purchaseProduct = (id) => {
    this.setState({ loading: true })
    const row = this.state.products.find((x) => x.id === id);
    const mySelectedValue = row[row.selectedValue];
    this.state.songstore.methods.purchaseProduct(id).send({ from: this.state.account, value: mySelectedValue})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  onSelectChange = (selectedValue, product) => {
    this.setState({
      products: this.state.products.map((x) => x.id === product.id ? { ...x, selectedValue } : x
      )
    });
  }


  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">       
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  products={this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct}
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
