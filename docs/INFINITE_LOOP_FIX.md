# Infinite Loop Fix - Step4Services Component

## Problem
React threw "Maximum update depth exceeded" error when opening the certification wizard, specifically in the `Step4Services` component with the Select component.

## Root Cause
The infinite loop was caused by object reference instability in the React state management:

1. **Default Parameter Issue**: `options = {}` in the component props created a new object on every render
2. **State Update Issue**: Every call to `setDeliveryMethod`, `toggleOption`, or `setInsurance` created a new `options` object
3. **useEffect Dependency**: The `useEffect` depended on the `options` object, which had a new reference every render
4. **Render Cycle**: This created an infinite loop: render → new options object → useEffect triggers → state update → render → repeat

## Stack Trace Analysis
```
SelectTrigger → Step4Services → CertificationWizard → CertificationButton
```

The error originated from the Select component's ref handling, which was being called repeatedly due to the re-renders.

## Solution

### 1. Fixed Default Options (`Step4Services.tsx`)
**Before:**
```typescript
export function Step4Services({
  options = {},  // ❌ Creates new object every render
  ...
}: Step4ServicesProps) {
```

**After:**
```typescript
const DEFAULT_OPTIONS: PricingOptions = {};  // ✅ Stable reference

export function Step4Services({
  options,  // ✅ No default in signature
  ...
}: Step4ServicesProps) {
  const currentOptions = options || DEFAULT_OPTIONS;  // ✅ Use stable default
```

### 2. Fixed State Updates (`use-certification-form.ts`)
**Before:**
```typescript
const setDeliveryMethod = (deliveryMethod: DeliveryMethod) => {
  setFormData((prev) => ({
    ...prev,
    options: {
      ...prev.options,  // ❌ Always creates new object
      deliveryMethod,
    },
  }));
};
```

**After:**
```typescript
const setDeliveryMethod = (deliveryMethod: DeliveryMethod) => {
  setFormData((prev) => {
    const currentOptions = prev.options || {};
    // ✅ Only update if value actually changed
    if (currentOptions.deliveryMethod === deliveryMethod) {
      return prev;  // ✅ Return same reference
    }
    return {
      ...prev,
      options: {
        ...currentOptions,
        deliveryMethod,
      },
    };
  });
};
```

Applied same pattern to:
- `toggleOption()`
- `setInsurance()`

### 3. Fixed useEffect Dependencies
**Before:**
```typescript
useEffect(() => {
  if (selectedService) {
    const pricing = calculatePricing(selectedService, options);
    setTotalPrice(pricing.totalPrice);
    setBreakdown(pricing.breakdown);
  }
}, [selectedService, options]);  // ❌ options is new object every render
```

**After:**
```typescript
useEffect(() => {
  if (!selectedService) {
    return;
  }

  const pricing = calculatePricing(selectedService, currentOptions);
  setTotalPrice(pricing.totalPrice);
  setBreakdown(pricing.breakdown);
}, [selectedService, currentOptions]);  // ✅ currentOptions has stable reference
```

## Key Principles Applied

### 1. **Object Reference Stability**
- Never use `{}` as a default parameter - it creates a new object every render
- Extract default objects to constants outside the component
- Use `||` with stable default reference

### 2. **Conditional State Updates**
- Check if the value actually changed before calling setState
- Return the previous state if no change needed
- This prevents unnecessary re-renders

### 3. **Early Returns in useEffect**
- Check conditions and return early
- Prevents running effect when not needed
- Cleaner than wrapping everything in an if statement

## Testing Checklist
- [x] Wizard opens without crashing
- [x] Can select service tiers
- [x] Custodia options appear correctly
- [x] Checkboxes toggle without errors
- [x] Select insurance works without infinite loop
- [x] Delivery method radio buttons work
- [x] Price calculation updates correctly
- [x] No console errors or warnings

## Files Modified
1. `/src/components/dashboard/certification/steps/Step4Services.tsx`
   - Added `DEFAULT_OPTIONS` constant
   - Changed `options` parameter to no longer have default
   - Used `currentOptions` throughout component
   - Simplified useEffect with early return

2. `/src/hooks/use-certification-form.ts`
   - Added value change checks in `setDeliveryMethod`
   - Added value change checks in `setInsurance`
   - Modified `toggleOption` to use current value check
   - All three functions now return previous state if unchanged

## Performance Impact
✅ **Positive**: Fewer unnecessary re-renders
✅ **Positive**: State updates only when values actually change
✅ **Positive**: Stable object references prevent cascade updates

## Related Patterns
This same pattern should be applied to:
- Any component that receives object/array props with defaults
- Any state updater that creates new objects
- Any useEffect that depends on object/array references

## Prevention Tips
1. **Never use object/array literals as default parameters**
   ```typescript
   // ❌ BAD
   function Component({ data = {} }) { }

   // ✅ GOOD
   const DEFAULT_DATA = {};
   function Component({ data }) {
     const currentData = data || DEFAULT_DATA;
   }
   ```

2. **Always check if state actually changed**
   ```typescript
   // ❌ BAD
   setState({ ...prev, value: newValue });

   // ✅ GOOD
   setState(prev => {
     if (prev.value === newValue) return prev;
     return { ...prev, value: newValue };
   });
   ```

3. **Use stable references in useEffect**
   ```typescript
   // ❌ BAD
   useEffect(() => { }, [objectProp]);

   // ✅ GOOD
   const stableRef = objectProp || DEFAULT_OBJECT;
   useEffect(() => { }, [stableRef]);
   ```

## Related React Patterns
- **Memoization**: Consider `useMemo` for expensive computations
- **Callback Stability**: Use `useCallback` for callback props
- **Ref Stability**: Use `useRef` for values that shouldn't trigger re-renders

---

**Status**: ✅ Fixed
**Date**: October 20, 2025
**Impact**: Critical - Wizard now functional
