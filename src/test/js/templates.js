import {ChartManager} from './chart_manager'
import {ChartSettings} from './chart_settings'
import * as data_providers from './data_providers'
import * as areas from './areas'
import * as plotters from './plotters'
import {Timeline} from './timeline'
import {CName} from './cname'
import * as layouts from './layouts'
import * as ranges from './ranges'

export class Template {

    static displayVolume = false;

    static createTableComps(dsName) {
        this.createMainChartComps('frame0.k0');
        if (this.displayVolume) {
            this.createIndicatorChartComps('frame0.k0', "VOLUME");
        }
        this.createTimelineComps('frame0.k0');
    }

    // 创建主视图表及其组件
    static createMainChartComps() {
        let mgr = ChartManager.instance;
        let tableLayout = mgr.getArea("frame0.k0.charts");
        let area = new areas.MainArea("frame0.k0.main");
        mgr.setArea("frame0.k0.main", area);
        tableLayout.addArea(area);
        let rangeArea = new areas.MainRangeArea("frame0.k0.mainRange");
        mgr.setArea("frame0.k0.mainRange", rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.MainDataProvider("frame0.k0.main.main");
        mgr.setDataProvider(dp.getName(), dp);
        mgr.setMainIndicator('frame0.k0', "MA");
        let range = new ranges.MainRange("frame0.k0.main");
        mgr.setRange(range.getName(), range);
        range.setPaddingTop(28);
        range.setPaddingBottom(12);
        let plotter = new plotters.MainAreaBackgroundPlotter("frame0.k0.main.background");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.CGridPlotter("frame0.k0.main.grid");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.CandlestickPlotter("frame0.k0.main.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.MinMaxPlotter("frame0.k0.main.decoration");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.MainInfoPlotter("frame0.k0.main.info");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.SelectionPlotter("frame0.k0.main.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.CDynamicLinePlotter("frame0.k0.main.tool");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeAreaBackgroundPlotter("frame0.k0.mainRange.background");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangePlotter("frame0.k0.mainRange.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter("frame0.k0.mainRange.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.LastClosePlotter("frame0.k0.mainRange.decoration");
        mgr.setPlotter(plotter.getName(), plotter);
    }

    static createIndicatorChartComps(dsName, indicName) {
        let mgr = ChartManager.instance;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        let rowIndex = tableLayout.getAreaCount() >> 1;
        let heights = ChartSettings.get().charts.areaHeight;
        if (heights.length > rowIndex) {
            let a, i;
            for (i = 0; i < rowIndex; i++) {
                a = tableLayout.getAreaAt(i << 1);
                a.setTop(0);
                a.setBottom(heights[i]);
            }
            area.setTop(0);
            area.setBottom(heights[rowIndex]);
        }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === false) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.IndicatorPlotter(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.IndicatorInfoPlotter(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
    }

    static createTimelineComps(dsName) {
        let mgr = ChartManager.instance;
        let plotter;
        let timeline = new Timeline(dsName);
        mgr.setTimeline(timeline.getName(), timeline);
        plotter = new plotters.TimelineAreaBackgroundPlotter(dsName + ".timeline.background");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.TimelinePlotter(dsName + ".timeline.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.TimelineSelectionPlotter(dsName + ".timeline.selection");
        mgr.setPlotter(plotter.getName(), plotter);
    }

}

export class DefaultTemplate extends Template {

    // 载入模板
    static loadTemplate() {
        let mgr = ChartManager.instance;
        // 获取frame Name / frame0 
        let frameName = (new CName('frame0.k0')).getCompAt(0);
        let frame = new layouts.DockableLayout(frameName);
        mgr.setFrame(frameName, frame);
        mgr.setArea(frameName, frame);
        let timelineArea = new areas.TimelineArea("frame0.k0.timeline");
        mgr.setArea(timelineArea.getName(), timelineArea);
        frame.addArea(timelineArea);
        timelineArea.setDockStyle(areas.ChartArea.DockStyle.Bottom);
        timelineArea.Measuring.addHandler(timelineArea, TemplateMeasuringHandler.onMeasuring);
        let tableLayout = new layouts.TableLayout("frame0.k0.charts");
        mgr.setArea(tableLayout.getName(), tableLayout);
        tableLayout.setDockStyle(areas.ChartArea.DockStyle.Fill);
        frame.addArea(tableLayout);
        this.createTableComps('frame0.k0');
        // 返回k线的设置选项 设置主题颜色
        let settings = ChartSettings.get();
        mgr.setThemeName(frameName, settings.theme);
        return mgr;
    }

}


export class TemplateMeasuringHandler {

    static onMeasuring(sender, args) {
        let width = args.Width;
        let height = args.Height;
        let areaName = sender.getNameObject().getCompAt(2);
        if (areaName === "timeline") {
            sender.setMeasuredDimension(width, 22);
        }
    }

}
