# Orchard UI

Orchard UI is a set of custom Lovelace strategies for building dynamic Home
Assistant dashboards. The project exposes ready‑made layouts for homes, floors,
rooms and device specific views.

## Setup

Install the dependencies using **Yarn**:

```bash
yarn install
```

Run a development build that watches for changes:

```bash
yarn dev
```

Build the production bundle:

```bash
yarn build
```

## Testing

Execute the unit tests with:

```bash
yarn test
```

## Installing in Home Assistant

The plugin can be installed manually or through **HACS**.

### Manual Installation

1. Run `yarn build` and copy `dist/index.js` to
   `<config>/www/orchard-ui.js` on your Home Assistant instance.
2. In **Settings → Dashboards → Resources** add `/local/orchard-ui.js` as a
   module.

### HACS

Add this repository as a custom frontend repository in HACS and install
**Orchard UI** from the HACS interface.

## Example configuration

Use the strategy in a dashboard configuration:

```yaml
strategy:
  type: custom:orchard-ui-home
  areas:
    - id: kitchen
    - id: living_room
```

![Orchard UI Home Screenshot](./public/screenshot-home.png)
