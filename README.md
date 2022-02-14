# ALT:V MP Server-side Entity Streamers
A server-side C# implementation of entity streamers for ALT:V MP.

This is an updated version of my previous streamers that I released a few years ago:
https://github.com/CoffeeGen/altv-object-streamer
https://github.com/CoffeeGen/altv-textlabel-streamer
https://github.com/CoffeeGen/altv-marker-streamer

This version is updated to work with altV 9.x, it uses RML UI for textlabels and the client-side has mostly been re-written in TypeScript with a sort of factory pattern to direct each entity sync event to the proper streamer.

These streamers are used on my Los Angeles Cops & Robbers server(after 2.0 launch) (https://invite.gg/lacnr).

Special thanks to: 
- Heron for the entity sync and C# module.
- Stuyk for his typescript boilerplate, which I used for the build commands and to set up typescript etc.
- altV MP Team <3

## Installation
- This resource makes use of the ``AltV.Net.EntitySync (v1.13.0)`` and ``AltV.Net.EntitySync.ServerEvent (v9.0.2)`` nuget package, make sure to install those prior to using this resource.
- Copy ``server/Init.cs`` to your gamemode.
- Make sure to add the following code to your gamemode's OnStart() method(entity sync won't work without it!):
```csharp
AltStreamers.Init(); // you probably need to import the AltV.Streamers namespace.
```
- Copy ``client/build`` to your ``server-root/resources`` directory (you can rename the folder to whatever you want).
- Copy-paste the rest of the .cs server files to your gamemode. You can also choose to only use those that you need and skip the rest.
- Enjoy!

## Building the client
The client is written in TypeScript, if you make changes to these files, you will have to re-build them to .js files.
To rebuild them, simply type ``npm run build`` and it should output the new files in your ``build`` directory.

## Usage

### Objects
The following global methods are available:
```csharp
// Create a new object on the map, returns the created object.
DynamicObject CreateDynamicObject(
    string model, Vector3 position, Vector3 rotation, int dimension = 0, bool isDynamic = false, bool frozen = true,
    uint? lodDistance = null,
    Rgb lightColor = null, bool onFire = false, TextureVariation? textureVariation = null, bool visible = true,
    uint streamRange = 150
);

// Destroy a dynamnic object
bool DestroyDynamicObject( DynamicObject obj );

// Get a dynamic object by entity ID
T GetDynamicObjectByEntityId<T>( ulong entityId );

// Destroy all dynamic objects of a given type
void DestroyAllDynamicObjects<T>( );

// Get the closest dynamic object of given type to the specified Vector3 position.
(T obj, float distance) GetClosestDynamicObjectOfType<T>( Vector3 pos )

// Destroy all created objects.
void DestroyAllDynamicObjects( );

// Get a list of all created objects by type.
List<T> GetAllDynamicObjects<T>( )
```

Each object has its own set of methods that can be used to change properties:
```csharp
// Get/set object's rotation
Vector3 Rotation { get; set; }

// Get/set object's position
Vector3 Position { get; set; }

// Get/set object's model
string Model { get; set; }

// Get/set LOD Distance (default null)
uint? LodDistance { get; set; }

// Get/set object's texture variation (default null)
TextureVariation? TextureVariation { get; set; }

// Get/set object's dynamic state (default null)
bool? Dynamic { get; set; }

// Get/set object's visibility state (default null) 
bool? Visible { get; set; }

// Get/set object's on fire state (default null) (don't use this as of right now, it does create a fire but it's very small. requires further native testing).
bool? OnFire { get; set; }

// Get/set object's frozen state (default null)
bool? Frozen { get; set; }

// Get/set object's light color (default null)
Rgb LightColor { get; set; }
```

#### Examples
```csharp
// Create an object.
DynamicObject obj = ObjectStreamer.CreateDynamicObject( "bkr_prop_biker_bblock_cor", new Vector3( -859.655f, -803.499f, 25.566f ), new Rotation( 0, 0, 0 ), 0 );

// Change object into a house.
obj.Model = "lf_house_17_";

// Change position.
obj.Position = new Position( 300f, 500f, 25f ); // Accepts both Vector3 and Position types.

// Change rotation.
obj.Rotation = new Rotation( 0f, 0f, 25f ); // Accepts both Vector3 and Rotation types.

// Hide the object
obj.Visible = false;

// Set an object's texture variation
obj.TextureVariation = TextureVariation.Nautical;

// Set an object's light color
obj.LightColor = new Rgb( 25, 49, 120 ); // random

// Freeze an object
obj.Frozen = true;

// Destroy the object
ObjectStreamer.DestroyDynamicObject( obj ); // has an overload method that accepts an ID instead of object instance.
```

### World Objects (remove objects from GTA map)
The following global methods are available:
```csharp
// Remove an existing world object from the map(eg a rockstar object, NOT one you added yourself!)
WorldObject DeleteWorldObject( string model, Vector3 position, float radius = 5, uint range = 50, bool visible = false );
```

Each world object has its own set of methods that can be used to change properties:
```csharp
// Get/set model
string Model { get; set; }

// Get/set radius in which to search for the object
float Radius { get; set; }

// Get/Set whether this one should be visible on the map or not (false = removes the object from the map)
bool Visible { get; set; }
```

#### Examples
```csharp
ObjectStreamer.DeleteWorldObject( "some_object_model", new Vector3( 123f, 456f, 789f ), 5 );
```

### Textlabels
The textlabel streamer makes use of altV's newly implemented RML UI for high performance textlabels.

The following global methods are available:
```csharp
// Create a new textlabel on the map, returns the created textlabel.
DynamicTextLabel CreateDynamicTextLabel( 
    string text, Vector3 position, int dimension = 0, Rgba? color = null, int? scale = null, uint streamRange = 25
);

// Destroy a textlabel by it's ID or textlabel instance. returns true if successful.
bool DestroyDynamicTextLabel( ulong dynamicTextLabelId );
void DestroyDynamicTextLabel( DynamicTextLabel dynamicTextLabel );

// Get a textlabel by it's ID. returns the textlabel if successful or null if not.
DynamicTextLabel GetDynamicTextLabel( ulong dynamicTextLabelId );

// Destroy all created textlabels.
void DestroyAllDynamicTextLabels( );

// Get a list of all created textlabels.
List<DynamicTextLabel> GetAllDynamicTextLabels( );
```

Each textlabel has it's own set of methods and properties that can be used:
```csharp
// Get/set textlabel's position.
Vector3 Position { get; set; }

// Get/set scale of the textlabel (currently not functional).
int? Scale { get; set; }

// Get/set the textlabel's text.
string Text { get; set; }

// Get/set the textlabel's color.
Rgba Color { get; set; }

// Destroy the textlabel and all it's data.
void Destroy( );
```

#### Examples
```csharp
// Create a textlabel.
DynamicTextLabel textLabel = TextLabelStreamer.CreateDynamicTextLabel( "Some Text", new Vector3( -879.655f, -853.499f, 19.566f ), 0, new Rgba( 255, 255, 255, 255 ) );

// Change textlabel text.
textLabel.Text = "Some other text";

// Change position.
textLabel.Position = new Position( 300f, 500f, 25f ); // Accepts both Vector3 and Position types.

// Set the textlabel's color
textLabel.Color = new Rgba( 25, 49, 120, 255 ); // random

// Destroy the textlabel
TextLabelStreamer.DestroyDynamicTextLabel( textLabel ); // has an overload method that accepts an ID instead of textlabel instance.
```


### Markers
The following global methods are available:
```csharp
// Create a new marker on the map, returns the created marker.
DynamicMarker CreateDynamicMarker(
    MarkerType markerType, Vector3 position, Vector3 scale, Vector3? rotation = null, Vector3? direction = null,
    Rgba? color = null,
    bool? bobUpDown = false, bool? faceCamera = false, bool? rotate = false, string textureDict = null,
    string textureName = null,
    bool? drawOnEnter = false, int dimension = 0, uint streamRange = 50
);

// Destroy an marker by it's ID or marker instance. returns true if successful.
bool DestroyDynamicMarker( ulong dynamicMarkerId );
void DestroyDynamicMarker( DynamicMarker marker );

// Get an marker by it's ID. returns the marker if successful or null if not.
DynamicMarker GetDynamicMarker( ulong dynamicMarkerId );

// Destroy all created markers.
void DestroyAllDynamicMarkers( );

// Get a list of all created markers.
List<DynamicMarker> GetAllDynamicMarkers( );
```

Each marker has it's own set of methods and properties that can be used:
```csharp
// Get/set marker's rotation.
Vector3 Rotation { get; set; }

// Get/set marker's position.
Vector3 Position { get; set; }

// Get/set marker's texture dictionary
string TextureDict { get; set; }

// Get/set marker's texture name.
string TextureName { get; set; }

// Get/set whether the marker should rotate on the Y axis(heading).
bool? Rotate { get; set; }

// Get/set whether the marker should be drawn onto the entity when they enter it.
bool? DrawOnEnter { get; set; }

// Get/set whether the marker should rotate on the Y axis towards the player's camera.
bool? FaceCamera { get; set; }

// Get/set whether the marker should bob up and down.
bool? BobUpDown { get; set; }

// Get/set scale of the marker.
Vector3 Scale { get; set; }

// Get/set - Represents a heading on each axis in which the marker should face, alternatively you can rotate each axis independently with Rotation and set Direction axis to 0.
Vector3 Direction { get; set; }

// Get/set the current marker's type(see MarkerTypes enum).
MarkerTypes MarkerType { get; set; }

// Get/set marker color. (default white)
Rgba? Color { get; set; }

// Destroy the marker and all it's data.
void Destroy( );
```

#### Examples
```csharp
// Create a marker.
DynamicMarker marker = MarkerStreamer.CreateDynamicMarker( MarkerType.MarkerTypeVerticalCylinder, new Vector3( -879.655f, -853.499f, 19.566f ), new Vector3( 1 ), color: new Rgba( 125, 52, 21, 255 ) );

// Change marker type into plane model.
marker.MarkerType = MarkerType.MarkerTypePlaneMode;

// Change position.
marker.Position = new Position( 300f, 500f, 25f ); // Accepts both Vector3 and Position types.

// Change rotation.
marker.Rotation = new Rotation( 0f, 0f, 25f ); // Accepts both Vector3 and Rotation types.

// Set an marker's color
marker.LightColor = new Rgba( 25, 49, 120, 255 ); // random

// Destroy the marker
MarkerStreamer.DestroyDynamicMarker( marker ); // has an overload method that accepts an ID instead of marker instance.
```