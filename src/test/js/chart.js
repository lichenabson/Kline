import {ChartManager} from './chart_manager'
import {Control} from './control'
import Kline from './kline'
import {Template} from './templates'

export class Chart {

    static strPeriod = {
        'zh-cn': {
            'line': '(分时)',
            '1min': '(1分钟)',
            '5min': '(5分钟)',
            '15min': '(15分钟)',
            '30min': '(30分钟)',
            '1hour': '(1小时)',
            '1day': '(日线)',
            '1week': '(周线)',
            '3min': '(3分钟)',
            '2hour': '(2小时)',
            '4hour': '(4小时)',
            '6hour': '(6小时)',
            '12hour': '(12小时)',
            '3day': '(3天)'
        },
        'en-us': {
            'line': '(Line)',
            '1min': '(1m)',
            '5min': '(5m)',
            '15min': '(15m)',
            '30min': '(30m)',
            '1hour': '(1h)',
            '1day': '(1d)',
            '1week': '(1w)',
            '3min': '(3m)',
            '2hour': '(2h)',
            '4hour': '(4h)',
            '6hour': '(6h)',
            '12hour': '(12h)',
            '3day': '(3d)'
        },
        'zh-tw': {
            'line': '(分時)',
            '1min': '(1分鐘)',
            '5min': '(5分鐘)',
            '15min': '(15分鐘)',
            '30min': '(30分鐘)',
            '1hour': '(1小時)',
            '1day': '(日線)',
            '1week': '(周線)',
            '3min': '(3分鐘)',
            '2hour': '(2小時)',
            '4hour': '(4小時)',
            '6hour': '(6小時)',
            '12hour': '(12小時)',
            '3day': '(3天)'
        }
    };

    constructor() {
        this._data = null;
        this._charStyle = "CandleStick";
        this.strIsLine = false;
        this._range = Kline.instance.range;
        this._symbol = Kline.instance.symbol;
    }


    setSymbol(symbol) {
        this._symbol = symbol;
        this.updateDataAndDisplay();
    }

    updateDataAndDisplay() {
        // Kline.instance.symbol = this._symbol;
        // Kline.instance.range = this._range;
        ChartManager.instance.setCurrentDataSource('frame0.k0', this._symbol + '.' + this._range);
        ChartManager.instance.setNormalMode();
        // let f = Kline.instance.chartMgr.getDataSource("frame0.k0").getLastDate();

        // $('.symbol-title>a').text(Kline.instance.symbolName);

        Control.requestData();
        // ChartManager.instance.redraw('All', false);
    }

    setCurrentPeriod(period) {
        this._range = Kline.instance.periodMap[period];
        if (Kline.instance.type === "stomp" && Kline.instance.stompClient.ws.readyState === 1) {
            Kline.instance.subscribed.unsubscribe();
            Kline.instance.subscribed = Kline.instance.stompClient.subscribe(Kline.instance.subscribePath + '/' + Kline.instance.symbol + '/' + this._range, Control.subscribeCallback);
        }
        this.updateDataAndDisplay();
        Kline.instance.onRangeChange(this._range);
    }

    updateDataSource(data) {
        this._data = data;
        ChartManager.instance.updateData("frame0.k0", this._data);
    }

    setMainIndicator(indicName) {
        this._mainIndicator = indicName;
        if (indicName === 'NONE') {
            ChartManager.instance.removeMainIndicator('frame0.k0');
        } else {
            ChartManager.instance.setMainIndicator('frame0.k0', indicName);
        }
        ChartManager.instance.redraw('All', true);
    }

    setIndicator(index, indicName) {
        if (indicName === 'NONE') {
            let index = 2;
            if (Template.displayVolume === false)
                index = 1;
            let areaName = ChartManager.instance.getIndicatorAreaName('frame0.k0', index);
            if (areaName !== '')
                ChartManager.instance.removeIndicator(areaName);
        } else {
            let index = 2;
            if (Template.displayVolume === false)
                index = 1;
            let areaName = ChartManager.instance.getIndicatorAreaName('frame0.k0', index);
            if (areaName === '') {
                Template.createIndicatorChartComps('frame0.k0', indicName);
            } else {
                ChartManager.instance.setIndicator(areaName, indicName);
            }
        }
        ChartManager.instance.redraw('All', true);
    }

    addIndicator(indicName) {
        ChartManager.instance.addIndicator(indicName);
        ChartManager.instance.redraw('All', true);
    }

    removeIndicator(indicName) {
        let areaName = ChartManager.instance.getIndicatorAreaName(2);
        ChartManager.instance.removeIndicator(areaName);
        ChartManager.instance.redraw('All', true);
    };

}