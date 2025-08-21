# Database Schema

The SQLite database consists of the following tables:

1. **routes**
   - **id**: Integer, primary key
   - **name**: Text, name of the route
   - **created_at**: Timestamp, when the route was created

2. **route_points**
   - **id**: Integer, primary key
   - **route_id**: Integer, foreign key referencing routes(id)
   - **seq**: Integer, sequence number of the point in the route
   - **lat**: Float, latitude of the point
   - **lon**: Float, longitude of the point
   - **dist_nm**: Float, distance in nautical miles from the previous point

3. **vessels**
   - **id**: Integer, primary key
   - **name**: Text, name of the vessel
   - **base_speed_kn**: Float, base speed of the vessel in knots
   - **lightship_t**: Float, lightship weight of the vessel
   - **created_at**: Timestamp, when the vessel was created

4. **forecasts**
   - **id**: Integer, primary key
   - **segment_id**: Integer, foreign key referencing route_points(id)
   - **dt_iso**: Timestamp, forecast datetime in ISO format
   - **wind_speed_ms**: Float, wind speed in meters per second
   - **wind_deg**: Float, wind direction in degrees
   - **hs_m**: Float, significant wave height in meters
   - **tp_s**: Float, wave period in seconds
   - **created_at**: Timestamp, when the forecast was created

# Seeding the Database

To seed the database with sample data, run the following command:

```bash
python data/init_db.py
```

This will create the SQLite database at `./data/data.db` and populate it with sample routes and vessels for testing and demonstration purposes.