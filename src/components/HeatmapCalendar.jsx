import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';

const HeatmapCalendar = ({ data }) => {
  const calendarData = data.map(entry => ({
    day: entry.date,
    value: entry.moodScore
  }));

  return (
    <div className='text-bluegray' style={{ height: '200px' }}>
      <ResponsiveCalendar
        data={calendarData}
        from={new Date(new Date().getFullYear(), 0, 1)}
        to={new Date(new Date().getFullYear(), 11, 31)}
        emptyColor="#eeeeee"
        colors={['#ac92eb', '#967adc', '#8363d2', '#704dc9', '#5d37bf']}
        margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
        yearSpacing={40}
        monthBorderColor="#ffffff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        theme={{
          text: {
            fontSize: 13,
            fill: '#ff5722',
          },
        }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'row',
            translateY: 36,
            itemCount: 4,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            itemDirection: 'right-to-left'
          }
        ]}
      />
    </div>
  );
};

export default HeatmapCalendar;
