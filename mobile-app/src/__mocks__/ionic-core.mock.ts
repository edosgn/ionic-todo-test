/**
 * Mock for @ionic/core/components ES module.
 *
 * Jest cannot properly handle ES modules from @ionic/core/components.
 * This mock provides empty implementations so that tests can import
 * Ionic components without runtime errors.
 */
export const defineCustomElement = () => {};
export const IonicSlides = () => {};

// Common Ionic component mocks
export const IonContent = () => {};
export const IonHeader = () => {};
export const IonToolbar = () => {};
export const IonTitle = () => {};
export const IonList = () => {};
export const IonItem = () => {};
export const IonLabel = () => {};
export const IonButton = () => {};
export const IonIcon = () => {};
export const IonFab = () => {};
export const IonFabButton = () => {};
export const IonSearchbar = () => {};
export const IonSpinner = () => {};
export const IonText = () => {};
export const IonNote = () => {};
export const IonCard = () => {};
export const IonCardHeader = () => {};
export const IonCardTitle = () => {};
export const IonCardContent = () => {};
export const IonItemSliding = () => {};
export const IonBackButton = () => {};
export const IonButtons = () => {};
export const IonCheckbox = () => {};
export const IonInput = () => {};
export const IonTextarea = () => {};
export const IonSelect = () => {};
export const IonSelectOption = () => {};
export const IonModal = () => {};
export const IonAlert = () => {};
export const IonToast = () => {};
export const IonToggle = () => {};
