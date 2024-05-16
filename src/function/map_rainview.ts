import axios from 'axios';

class Rainview {

    private async getRainview(){
        const res:any = await axios.get('https://api.rainviewer.com/public/weather-maps.json');
        return res.data;
    }

    public async getRainviewUrl(){
        const data = await this.getRainview();
        const url = data.host;
        return url;
    }

    public async getNowcastPath(){
        const data = await this.getRainview();
        const url = data.radar.nowcast[0].path;
        return url;
    }
}

export default Rainview;