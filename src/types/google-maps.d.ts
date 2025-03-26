
declare interface Window {
  google: typeof google;
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element | null, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setOptions(options: MapOptions): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      panBy(x: number, y: number): void;
      getCenter(): LatLng;
      getZoom(): number;
      getBounds(): LatLngBounds | undefined;
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral, padding?: number | Padding): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      toString(): string;
      toUrlValue(precision?: number): string;
      toJSON(): LatLngLiteral;
      equals(other: LatLng): boolean;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      extend(point: LatLng | LatLngLiteral): LatLngBounds;
      contains(latLng: LatLng | LatLngLiteral): boolean;
      getCenter(): LatLng;
      getSouthWest(): LatLng;
      getNorthEast(): LatLng;
      toJSON(): LatLngBoundsLiteral;
      toString(): string;
      toUrlValue(precision?: number): string;
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setTitle(title: string): void;
      setLabel(label: string | MarkerLabel): void;
      setIcon(icon: string | Icon | Symbol): void;
      setZIndex(zIndex: number): void;
      getPosition(): LatLng | undefined;
      getTitle(): string | undefined;
      getLabel(): string | MarkerLabel | undefined;
      getIcon(): string | Icon | Symbol | undefined;
      addListener(eventName: string, handler: Function): MapsEventListener;
      setAnimation(animation: Animation | null): void;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(options: InfoWindowOpenOptions): void;
      open(map: Map | StreetViewPanorama, anchor?: MVCObject): void;
      close(): void;
      setContent(content: string | Node): void;
      setPosition(position: LatLng | LatLngLiteral): void;
      setZIndex(zIndex: number): void;
      getContent(): string | Node;
      getPosition(): LatLng;
      getZIndex(): number;
    }

    class NavigationControl {
      constructor(opts?: NavigationControlOptions);
    }

    class places {
      static SearchBox: {
        new(
          inputField: HTMLInputElement,
          opts?: SearchBoxOptions
        ): SearchBox;
      };
    }

    interface SearchBox {
      setBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
      getPlaces(): google.maps.places.PlaceResult[];
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    interface PlaceResult {
      geometry?: {
        location: LatLng;
        viewport?: LatLngBounds;
      };
      name?: string;
      formatted_address?: string;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      streetViewControl?: boolean;
      mapTypeControl?: boolean;
      fullscreenControl?: boolean;
      zoomControl?: boolean;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      label?: string | MarkerLabel;
      draggable?: boolean;
      animation?: Animation;
      zIndex?: number;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
      pixelOffset?: Size;
      zIndex?: number;
    }

    interface InfoWindowOpenOptions {
      map?: Map;
      anchor?: MVCObject;
      ariaLabel?: string;
    }

    interface MVCObject {}

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    interface Size {
      width: number;
      height: number;
    }

    interface Icon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
    }

    interface MarkerLabel {
      text: string;
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
    }

    interface Point {
      x: number;
      y: number;
    }

    interface Symbol {
      path: string | SymbolPath;
      fillColor?: string;
      fillOpacity?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    enum SymbolPath {
      BACKWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
      CIRCLE,
      FORWARD_CLOSED_ARROW,
      FORWARD_OPEN_ARROW
    }

    interface NavigationControlOptions {
      position?: ControlPosition;
      visualizePitch?: boolean;
    }

    interface SearchBoxOptions {
      bounds?: LatLngBounds | LatLngBoundsLiteral;
    }

    interface Padding {
      top: number;
      right: number;
      bottom: number;
      left: number;
    }

    enum ControlPosition {
      BOTTOM_CENTER,
      BOTTOM_LEFT,
      BOTTOM_RIGHT,
      LEFT_BOTTOM,
      LEFT_CENTER,
      LEFT_TOP,
      RIGHT_BOTTOM,
      RIGHT_CENTER,
      RIGHT_TOP,
      TOP_CENTER,
      TOP_LEFT,
      TOP_RIGHT
    }

    enum Animation {
      BOUNCE,
      DROP
    }

    interface MapsEventListener {
      remove(): void;
    }
  }
}
