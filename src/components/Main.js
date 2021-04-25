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
      <div className="add-song-wrapper">
        <h1>Add Song</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const title = this.songTitle.value
          const artist = this.songArtist.value
          const genre = this.songGenre.value
          const priceDigitalDownload = window.web3.utils.toWei(this.priceDigitalDownload.value.toString(), 'Ether')
          const priceCoverVersion = window.web3.utils.toWei(this.priceCoverVersion.value.toString(), 'Ether')
          const priceRegularLicense = window.web3.utils.toWei(this.priceRegularLicense.value.toString(), 'Ether')
          const priceExtendedLicense= window.web3.utils.toWei(this.priceExtendedLicense.value.toString(), 'Ether')

          this.props.createSong(title, artist, genre, priceDigitalDownload, priceCoverVersion, priceRegularLicense, priceExtendedLicense)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="songTitle"
              type="text"
              ref={(input) => { this.songTitle = input }}
              className="form-control"
              placeholder="Song's title"
              required />
          </div>
        <div className="form-group mr-sm-2">
          <input
              id="songArtist"
              type="text"
              ref={(input) => { this.songArtist = input }}
              className="form-control"
              placeholder="Name of the artist / band"
              required />
        </div>
          <div className="form-group mr-sm-2">
            <input
                id="songGenre"
                type="text"
                ref={(input) => { this.songGenre = input }}
                className="form-control"
                placeholder="Genre which it belongs to"
                required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceDigitalDownload"
              type="text"
              ref={(input) => { this.priceDigitalDownload = input }}
              className="form-control"
              placeholder="Price for Digital Download license"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceCoverVersion"
              type="text"
              ref={(input) => { this.priceCoverVersion = input }}
              className="form-control"
              placeholder="Price for Cover Version license"
              required />
           </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceRegularLicense"
              type="text"
              ref={(input) => { this.priceRegularLicense = input }}
              className="form-control"
              placeholder="Price for Regular License"
              required />
           </div>
          <div className="form-group mr-sm-2">
            <input
              id="priceExtendedLicense"
              type="text"
              ref={(input) => { this.priceExtendedLicense = input }}
              className="form-control"
              placeholder="Price for Extended License"
              required />
          </div>
          <button type="submit" className="btn btn-primary button" >Add Song</button>

        </form>
      </div>
        <p>&nbsp;</p>
      <div className="buy-song-wrapper">
        <h1 className="h1h1">Buy Song</h1>
        <table>
          <thead>
            <tr>
              <th scope="col" >#</th>
              <th scope="col">Title</th>
              <th scope="col">Artist</th>
              <th scope="col">Genre</th>
              <th scope="col" className="smaller-col">Price for Digital Download</th>
              <th scope="col" className="smaller-col">Price for Cover Version</th>
              <th scope="col" className="smaller-col">Price for Regular License</th>
              <th scope="col" className="smaller-col">Price for Extended License</th>
              <th scope="col">Owner</th>
              <th scope="col">Selection</th>
            </tr>
          </thead>
          <tbody id="songList">
            { this.props.songs.map((song, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{song.id.toString()}</th>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>{song.genre}</td>
                  <td className="smaller-col">{window.web3.utils.fromWei(song.priceDigitalDownload.toString(), 'Ether')} Eth</td>
                  <td className="smaller-col">{window.web3.utils.fromWei(song.priceCoverVersion.toString(), 'Ether')} Eth</td>
                  <td className="smaller-col">{window.web3.utils.fromWei(song.priceRegularLicense.toString(), 'Ether')} Eth</td>
                  <td className="smaller-col">{window.web3.utils.fromWei(song.priceExtendedLicense.toString(), 'Ether')} Eth</td>
                  <td className="owner">{song.owner}</td>

                  <td><select onChange={(event) => this.props.onSelectChange(event.target.value, song)} value={song.selectedValue}>

                        <option value="priceDigitalDownload">Digital Download</option>
                        <option value="priceCoverVersion">Cover Version</option>
                        <option value="priceRegularLicense">Regular License</option>
                        <option value="priceExtendedLicense">Extended License</option>

                      </select>

 
                    { !(song.owner === this.props.account)
                      ? <button name={song.id} className="button btn btn-primary"

                          onClick={(event) => {
                            this.props.purchaseSong(song.id)
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
      </div>
    );
  }
}

export default Main;