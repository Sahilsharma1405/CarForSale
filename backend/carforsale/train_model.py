import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import make_column_transformer
from sklearn.pipeline import make_pipeline
from sklearn.metrics import r2_score

print("--- Starting Final Model Training ---")

# 1. Load the new dataset
try:
    # Make sure your new Kaggle file is named 'usedcar_dataset_final.csv'
    df = pd.read_csv('used_cars_dataset_v2.csv')
    print("Successfully loaded the dataset.")
except FileNotFoundError:
    print("Error: Dataset file not found.")
    exit()

# 2. Clean and Prepare the Data
# Standardize column names for easier use
df.rename(columns={
    'Brand': 'brand', 'Year': 'year', 'kmDriven': 'km_driven',
    'Transmission': 'transmission', 'Owner': 'owner', 'FuelType': 'fuel_type',
    'AskPrice': 'price'
}, inplace=True)

# Drop columns we won't use
df.drop(['Age', 'PostedDate', 'AdditionalInfo'], axis=1, inplace=True, errors='ignore')

# Clean numerical columns by removing text and converting to numbers
df['km_driven'] = df['km_driven'].str.replace(r'[^\d]', '', regex=True)
df['price'] = df['price'].str.replace(r'[^\d]', '', regex=True)
df.dropna(inplace=True)
df = df[df['km_driven'] != '']
df = df[df['price'] != '']
df['km_driven'] = df['km_driven'].astype(int)
df['price'] = df['price'].astype(int)

# 3. Define the features the model will be trained on
features = ['brand', 'model', 'year', 'km_driven', 'transmission', 'owner', 'fuel_type']
target = 'price'

X = df[features]
y = df[target]

# 4. Create the preprocessing pipeline for text-based columns
categorical_features = ['brand', 'model', 'transmission', 'owner', 'fuel_type']
preprocessor = make_column_transformer(
    (OneHotEncoder(handle_unknown='ignore'), categorical_features),
    remainder='passthrough'
)

# 5. Define the model
model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
pipeline = make_pipeline(preprocessor, model)

# 6. Split data and train the final model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipeline.fit(X_train, y_train)

# 7. Evaluate and save the final model
accuracy = pipeline.score(X_test, y_test)
print(f"\nModel training complete. Final Accuracy (R-squared): {accuracy:.2f}")
joblib.dump(pipeline, 'price_model.pkl')
print("New, highly accurate model saved to 'price_model.pkl'")