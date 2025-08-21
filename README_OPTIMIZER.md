# Optimizer Documentation

## Replacing the Toy Model with Real Polars

This document outlines how to replace the toy model used in the optimizer with real polar data for more accurate speed optimization in maritime weather conditions.

### Overview of the Current Model

The current optimizer uses a simplified model based on the following assumptions:

- **Speed and Power Relationship**: The power required to maintain a certain speed is proportional to the cube of the speed.
- **Fuel Consumption**: Fuel consumption is calculated based on a fixed coefficient and the power required for the vessel's speed.
- **Wave Resistance**: A simple coefficient is used to account for wave resistance based on significant wave height (Hs).

### Steps to Integrate Real Polar Data

1. **Obtain Polar Data**: Acquire polar data for the vessel you are optimizing. This data should include speed vs. power curves at various conditions (e.g., different wave heights, wind speeds).

2. **Modify the Optimizer**:
   - Update the `optimizer.py` file to include a function that reads and processes the polar data.
   - Replace the toy model calculations with lookups from the polar data based on the current conditions (e.g., speed, wave height).

3. **Update Fuel Calculation**:
   - Adjust the `fuel_for_segment` function to use the real power values obtained from the polar data instead of the simplified model.
   - Ensure that the fuel consumption calculations reflect the actual performance of the vessel under varying conditions.

4. **Testing**:
   - Create unit tests to validate the new implementation. Ensure that the optimizer produces expected results when using real polar data.
   - Compare the results of the new model against the toy model to evaluate improvements in accuracy.

### Example Code Snippet

Here is a simplified example of how you might modify the `optimizer.py` to incorporate polar data:

```python
def load_polar_data(file_path):
    # Load polar data from a CSV or other format
    # Return a structured format for easy lookup
    pass

def fuel_for_segment(speed_kn, Hs_m, dist_nm, polar_data):
    # Use polar data to determine power required for the given speed
    power_required = lookup_power_from_polar(speed_kn, Hs_m, polar_data)
    fuel_t = calculate_fuel_from_power(power_required, dist_nm)
    return fuel_t
```

### Conclusion

By integrating real polar data into the optimizer, you can achieve more accurate and reliable speed optimization for maritime operations. This will enhance the overall effectiveness of the weather engine and provide better decision support for vessel routing and fuel management.