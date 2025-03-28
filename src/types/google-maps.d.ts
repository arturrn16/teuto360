declare interface Window {
  google: typeof google;
  initGoogleMaps?: () => void; // Add this to support the callback function
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
      isEmpty(): boolean; // Added this method to fix the TypeScript error
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

    class StreetViewPanorama {
      constructor(container: Element, opts?: StreetViewPanoramaOptions);
    }

    class Polyline {
      constructor(opts?: PolylineOptions);
      setMap(map: Map | null): void;
      getPath(): MVCArray<LatLng>;
      setPath(path: LatLng[] | LatLngLiteral[]): void;
    }

    class Geocoder {
      constructor();
      geocode(
        request: GeocoderRequest,
        callback: (results: GeocoderResult[], status: string) => void
      ): void;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      bounds?: LatLngBounds | LatLngBoundsLiteral;
      componentRestrictions?: GeocoderComponentRestrictions;
      region?: string;
    }

    interface GeocoderComponentRestrictions {
      country?: string | string[];
      administrativeArea?: string;
      locality?: string;
      postalCode?: string;
      route?: string;
    }

    interface GeocoderResult {
      address_components: GeocoderAddressComponent[];
      formatted_address: string;
      geometry: {
        location: LatLng;
        location_type: string;
        viewport: LatLngBounds;
        bounds?: LatLngBounds;
      };
      place_id: string;
      plus_code?: {
        compound_code: string;
        global_code: string;
      };
      types: string[];
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    namespace geometry {
      namespace spherical {
        function computeDistanceBetween(
          from: LatLng | LatLngLiteral,
          to: LatLng | LatLngLiteral,
          radius?: number
        ): number;
      }
    }

    interface PolylineOptions {
      path?: LatLng[] | LatLngLiteral[];
      geodesic?: boolean;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      visible?: boolean;
      zIndex?: number;
    }

    interface StreetViewPanoramaOptions {
      position?: LatLng | LatLngLiteral;
      pov?: StreetViewPov;
      zoom?: number;
      visible?: boolean;
    }

    interface StreetViewPov {
      heading?: number;
      pitch?: number;
    }

    namespace places {
      class SearchBox {
        constructor(inputField: HTMLInputElement, opts?: SearchBoxOptions);
        setBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
        getPlaces(): PlaceResult[];
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

      interface SearchBoxOptions {
        bounds?: LatLngBounds | LatLngBoundsLiteral;
      }
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

    class MVCArray<T> {
      constructor(array?: T[]);
      getArray(): T[];
      getAt(i: number): T;
      insertAt(i: number, elem: T): void;
      removeAt(i: number): T;
      setAt(i: number, elem: T): void;
      push(elem: T): number;
      pop(): T;
      forEach(callback: (elem: T, i: number) => void): void;
    }

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

    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      width: number;
      height: number;
      equals(other: Size): boolean;
      toString(): string;
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
      equals(other: Point): boolean;
      toString(): string;
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
