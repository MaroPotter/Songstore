import React, { Component } from 'react';

class Main extends Component {




  render() {

 // const optionsPrice = [
 //    {value: 'digital', label: 'Digital Download'},
 //    {value: 'digital', label: 'Cover Version'},
 //    {value: 'digital', label: 'Regular License'},
 //    {value: 'digital', label: 'Extended License'}
 //  ]; 

    return (
      <div id="content">
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const priceDigitalDownload = window.web3.utils.toWei(this.priceDigitalDownload.value.toString(), 'Ether')
          const priceCoverVersion = window.web3.utils.toWei(this.priceCoverVersion.value.toString(), 'Ether')
          const priceRegularLicense = window.web3.utils.toWei(this.priceRegularLicense.value.toString(), 'Ether')
          const priceExtendedLicense= window.web3.utils.toWei(this.priceExtendedLicense.value.toString(), 'Ether')

          this.props.createProduct(name, priceDigitalDownload, priceCoverVersion, priceRegularLicense, priceExtendedLicense)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceDigitalDownload"
              type="text"
              ref={(input) => { this.priceDigitalDownload = input }}
              className="form-control"
              placeholder="priceDigitalDownload"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceCoverVersion"
              type="text"
              ref={(input) => { this.priceCoverVersion = input }}
              className="form-control"
              placeholder="Price Cover Version"
              required />
           </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceRegularLicense"
              type="text"
              ref={(input) => { this.priceRegularLicense = input }}
              className="form-control"
              placeholder="Price Regular License"
              required />
           </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceExtendedLicense"
              type="text"
              ref={(input) => { this.priceExtendedLicense = input }}
              className="form-control"
              placeholder="Price Extended License"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col" >#</th>
              <th scope="col">Name</th>
              <th scope="col">Price Digital Download</th>
              <th scope="col">Price Cover Version</th>
              <th scope="col">Price Regular License</th>
              <th scope="col">Price Extended License</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.products.map((product, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{window.web3.utils.fromWei(product.priceDigitalDownload.toString(), 'Ether')} Eth</td>
                  <td>{window.web3.utils.fromWei(product.priceCoverVersion.toString(), 'Ether')} Eth</td>
                  <td>{window.web3.utils.fromWei(product.priceRegularLicense.toString(), 'Ether')} Eth</td>
                  <td>{window.web3.utils.fromWei(product.priceExtendedLicense.toString(), 'Ether')} Eth</td>
                  <td>{product.owner}</td>

                  <td><select onChange={(event) => this.props.onSelectChange(event.target.value, product)} value={product.selectedValue}>

                        <option value="priceDigitalDownload">Digital Download</option>
                        <option value="priceCoverVersion">Cover Version</option>
                        <option value="priceRegularLicense">Regular License</option>
                        <option value="priceExtendedLicense">Extended License</option>

                      </select>
                  </td>
                  <td>

 
                    { !product.purchased
                      ? <button name={product.id}

                          onClick={(event) => {
                            this.props.purchaseProduct(product.id)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;